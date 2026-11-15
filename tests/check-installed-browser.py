"""Live installed dsh, isolated profile, real settings RPC and reload persistence."""
import base64
import json
import sys
import time
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
PROMO = REPO.parent/'DeepClear-Promo'
HOME = PROMO/'02-assets/dsh-plugin-audit/test-home'
OUT = PROMO/'03-previews/deepclear-1.8.1'
sys.path.insert(0, str(PROMO/'04-scripts'))
from render_promo import Browser


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    b = Browser(port=9356)
    checks = []
    def until(expression):
        for _ in range(80):
            if b.js(expression):
                return
            time.sleep(.1)
        raise AssertionError(expression)
    def check(name, expression):
        until(expression)
        checks.append(name)
    def screenshot(name):
        (OUT/name).write_bytes(base64.b64decode(b.call('Page.captureScreenshot', {'format': 'png'})['data']))
    def toggle(name):
        selector = f'.dc-sheet-root button[aria-label="{name}"]'
        b.js(f'document.querySelector({json.dumps(selector)}).click()')
    try:
        b.call('Emulation.setDeviceMetricsOverride', {'width': 1440, 'height': 1000, 'deviceScaleFactor': 1, 'mobile': False})
        b.call('Page.navigate', {'url': (HOME/'preview-url.txt').read_text()})
        check('real installed host loads packaged plugin', '!!document.querySelector(".dc-foot-button") && !!document.querySelector("canvas.dwe-whale")')
        time.sleep(1)
        b.js('[...document.querySelectorAll("button")].find(x=>x.textContent.trim()==="继续")?.click()')
        time.sleep(.4)
        b.js('document.querySelector("[role=dialog] button[aria-label=关闭]")?.click()')
        time.sleep(1.5)
        screenshot('07-installed-home.png')
        b.js('document.querySelector(".dc-foot-button").click()')
        check('real Host exposes all settings as writable', 'document.querySelectorAll(".dc-sheet-root button[role=switch]").length===14 && !document.querySelector(".dc-sheet-root button[role=switch]").disabled')
        if b.js('document.documentElement.classList.contains("dc-off-code")'):
            toggle('代码配色')
            until('!document.documentElement.classList.contains("dc-off-code")')
        screenshot('08-installed-settings.png')
        toggle('代码配色')
        check('real RPC removes code layer', 'document.documentElement.classList.contains("dc-off-code") && !document.body.style.getPropertyValue("--shiki-token-keyword")')
        b.call('Page.reload')
        check('Host setting survives full browser reload', '!!document.querySelector(".dc-foot-button") && document.documentElement.classList.contains("dc-off-code") && !document.body.style.getPropertyValue("--shiki-token-keyword")')
        b.js('document.querySelector(".dc-foot-button").click()')
        until('document.querySelectorAll(".dc-sheet-root button[role=switch]").length===14')
        toggle('代码配色')
        check('real RPC restores palette without restart', '!document.documentElement.classList.contains("dc-off-code") && !!document.body.style.getPropertyValue("--shiki-token-keyword")')
        toggle('点阵人像与字标')
        check('real Host home restored when art disabled', '!document.querySelector("canvas.dwe-whale") && document.documentElement.classList.contains("dc-off-hero")')
        toggle('点阵人像与字标')
        check('real Host art reenabled once', 'document.querySelectorAll("canvas.dwe-whale").length===1')
        b.call('Input.dispatchKeyEvent', {'type': 'keyDown', 'key': 'Escape', 'code': 'Escape'})
        check('real settings dialog closes', '!document.querySelector(".dc-sheet-root")')
        assert not b.errors, b.errors
        patch = (HOME/'profiles/deepclear-preview/cordis.patch.yml').read_text(encoding='utf8')
        assert 'settingsMigrated' in patch and 'deepclear-ui' in patch
        checks.append('Host persisted preferences into isolated profile patch')
        report = {'host': 'installed 0.2.2-rc.3 web bundle', 'profile': 'isolated deepclear-preview', 'passed': checks, 'browserErrors': b.errors}
        (OUT/'installed-browser-checks.json').write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n', encoding='utf8')
        print(json.dumps(report, ensure_ascii=False))
    finally:
        b.close()


if __name__ == '__main__':
    main()
