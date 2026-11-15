"""Real React fixture checks and review stills, using isolated headless Edge."""
import base64
import functools
import http.server
import json
import sys
import threading
import time
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
PROMO = REPO.parent/'DeepClear-Promo'
AUDIT = PROMO/'02-assets/dsh-plugin-audit'
OUT = PROMO/'03-previews/deepclear-1.8.1'
sys.path.insert(0, str(PROMO/'04-scripts'))
from render_promo import Browser


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

    def do_GET(self):
        if self.path == '/theme.css':
            files = ['base.css', 'design-platform.css', 'focus.css', 'shiki.css']
            data = '\n'.join((AUDIT/'installed/dsh-client-ui-theme/src/styles'/file).read_text(encoding='utf-8') for file in files).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'text/css; charset=utf-8')
            self.end_headers()
            self.wfile.write(data)
        else:
            super().do_GET()


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    OUT.mkdir(parents=True, exist_ok=True)
    server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Handler, directory=str(REPO)))
    threading.Thread(target=server.serve_forever, daemon=True).start()
    b = Browser(port=9354)
    checks = []

    def check(name, expression):
        result = b.js(expression, True)
        assert result is True, (name, result)
        checks.append(name)

    def wait():
        b.js('new Promise(r=>setTimeout(r,90))', True)

    def screenshot(name):
        encoded = b.call('Page.captureScreenshot', {'format': 'png'})['data']
        (OUT/name).write_bytes(base64.b64decode(encoded))

    try:
        b.call('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 1000, 'deviceScaleFactor': 1, 'mobile': False})
        b.call('Page.navigate', {'url': f'http://127.0.0.1:{server.server_port}/tests/browser-fixture.html'})
        for _ in range(60):
            if b.js('typeof ready !== "undefined"'):
                break
            time.sleep(.1)
        b.js('ready', True)
        wait()
        check('real React stats and theme render', "document.querySelector('.dc-stats').textContent.includes('21%') && !document.body.style.getPropertyValue('--dsw-alias-bg-base')")
        screenshot('01-chat-dark.png')
        b.js("fixtureUpdate({value:{...formSnapshot.value,thinkingSphere:false},revision:formSnapshot.revision+1})"); wait()
        check('sphere off removes canvas without hiding host status', "!document.querySelector('canvas.dc-overlay') && document.querySelector('[data-chat-running]').textContent.includes('12')")
        b.js("fixtureUpdate({value:{...formSnapshot.value,thinkingSphere:true},revision:formSnapshot.revision+1})"); wait()
        b.js('fixtureScheme(false)'); wait()
        screenshot('02-chat-light.png')
        check('light theme changes accent and syntax together', "getComputedStyle(document.querySelector('strong')).color==='rgb(50, 105, 183)' && getComputedStyle(document.querySelector('.st')).color==='rgb(50, 107, 85)'")
        b.js("fixtureScheme(true);fixtureRender('settings')"); wait()
        check('all settings render', "document.querySelectorAll('#settings button[role=switch]').length===14")
        screenshot('03-settings-dark.png')
        # Drive Host snapshots to exercise real React hook counts independently of translated labels.
        for enabled in [False, True, False, True]:
            b.js(f"fixtureUpdate({{value:{{...formSnapshot.value,stats:{str(enabled).lower()}}},revision:formSnapshot.revision+1}})")
            wait()
            check('stats hook toggle '+str(enabled)+' '+str(len(checks)), f"!!document.querySelector('.dc-stats') === {str(enabled).lower()}")
        b.js("fixtureUpdate({value:{...formSnapshot.value,diff:false},revision:formSnapshot.revision+1})")
        wait()
        check('diff off restores host tokens without erasing syntax', "!document.body.style.getPropertyValue('--dsw-alias-file-diff-added-bg') && getComputedStyle(document.querySelector('.diff .st')).color==='rgb(165, 204, 184)'")
        b.js("fixtureUpdate({value:{...formSnapshot.value,diff:true},revision:formSnapshot.revision+1})")
        wait()
        check('diff on restores plugin layer', "!!document.body.style.getPropertyValue('--dsw-alias-file-diff-added-bg')")
        b.js("fixtureReject='refuse';document.querySelector('#settings button[aria-label=\"代码配色\"]').click()")
        wait()
        check('refused save is visible and controls recover', "!!document.querySelector('#settings [role=alert]') && !document.querySelector('#settings button[aria-label=\"代码配色\"]').disabled")
        b.js("fixtureReject=null;document.querySelector('#settings button[aria-label=\"代码配色\"]').click()")
        wait()
        check('successful toggle releases code layer', "!document.body.style.getPropertyValue('--shiki-token-keyword') && !!document.body.style.getPropertyValue('--dc-accent')")
        b.js("fixtureUpdate({value:{...defaults,settingsMigrated:true},revision:formSnapshot.revision+1});fixtureRender('home')")
        b.call('Emulation.setEmulatedMedia', {'features': [{'name': 'prefers-reduced-motion', 'value': 'reduce'}]})
        wait()
        check('hero owns one canvas and keeps children', "document.querySelectorAll('canvas.dwe-whale').length===1 && document.querySelector('.titleGroup')!==null")
        screenshot('04-home-dark.png')
        b.js("fixtureScheme(false)"); wait()
        screenshot('05-home-light.png')
        b.js("fixtureUpdate({value:{...formSnapshot.value,hero:false},revision:formSnapshot.revision+1})"); wait()
        check('hero off restores stock content', "document.querySelector('canvas.dwe-whale')===null && getComputedStyle(document.querySelector('.titleGroup')).display!=='none'")
        b.js("fixtureScheme(true);fixtureRender('chat')")
        b.call('Emulation.setDeviceMetricsOverride', {'width': 390, 'height': 844, 'deviceScaleFactor': 1, 'mobile': False})
        wait()
        check('narrow composer keeps submit visible', "document.querySelector('.send').getBoundingClientRect().right<=innerWidth && getComputedStyle(document.querySelector('.dc-stats-output')).display==='none'")
        screenshot('06-chat-narrow.png')
        b.call('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 1000, 'deviceScaleFactor': 1, 'mobile': False})
        b.js("document.querySelector('.dc-foot-button').click()"); wait()
        check('settings dialog gets focus', "document.querySelector('[role=dialog]').contains(document.activeElement)")
        b.call('Input.dispatchKeyEvent', {'type': 'keyDown', 'key': 'Escape', 'code': 'Escape'})
        wait()
        check('Escape closes dialog and returns focus', "document.querySelector('[role=dialog]')===null")
        errors = b.js('fixtureErrors')
        if errors:
            print(json.dumps(errors, ensure_ascii=False), flush=True)
        check('React has no errors or key/hook warnings', 'fixtureErrors.length===0')
        b.js('fixtureDispose()'); wait()
        check('unload removes theme style flags portal and tokens', "document.querySelector('style[data-dsh-plugin=deepclear-ui]')===null && ![...document.documentElement.classList].some(x=>x.startsWith('dc-off-')) && document.querySelector('.dc-sheet-root')===null && themeLayers.size===0")
        assert not b.errors, b.errors
        report = {'method': 'Real React 18 development renderer in isolated Edge; simulated public slot/configForms/theme services and installed host CSS; not a full live dsh session.', 'passed': checks, 'reactErrors': errors, 'browserErrors': b.errors, 'stills': sorted(p.name for p in OUT.glob('*.png'))}
        (OUT/'browser-checks.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
        print(json.dumps(report, ensure_ascii=False))
    finally:
        b.close()
        server.shutdown()


if __name__ == '__main__':
    main()
