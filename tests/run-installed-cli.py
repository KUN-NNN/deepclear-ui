"""Run the installed version's CLI with an isolated DSH_HOME, never user config."""
import os
import subprocess
import sys
from pathlib import Path

APP = Path('C:/Users/37861/AppData/Local/Programs/DeepSeek Harness')
REPO = Path(__file__).resolve().parents[1]
HOME = REPO.parent/'DeepClear-Promo/02-assets/dsh-plugin-audit/test-home'
code = '''const p=process.argv[1]+'/resources/app.asar/dsh/node_modules/@deepseek-ai/dsh/lib/bin.js';
process.argv=[process.execPath,p,...process.argv.slice(2)];
import(require('url').pathToFileURL(p)).then(m=>m.runCli()).catch(e=>{console.error(e);process.exitCode=1});'''
sys.exit(subprocess.call([str(APP/'DeepSeek Harness.exe'), '-e', code, str(APP), *sys.argv[1:]],
    cwd=REPO, env={**os.environ, 'ELECTRON_RUN_AS_NODE': '1', 'DSH_HOME': str(HOME)}))
