## 0527-2026 NOTES ##
investigating using 
- 1. existing django code
- 2. create an API on AWS perhaps EC2 with stock fish
- 3. steps below from claude 0527-2026

## Step 1 — Launch EC2 instance
✅Go to AWS console → EC2 → Launch Instance [0528_ec2_chess] [ubuntu]
✅Choose Ubuntu (latest LTS)
✅Choose t3.micro (free tier)
✅Create or select a key pair (you'll need this to SSH in) 
[05282026keypair][.pem OpenSSH]
✅In Security Group, ✅open ports 22 (SSH) and ✅8000 (Flask)
[TJS: NOTE: needed to be added to public subnet]


## Step 2 — SSH into your instance
bashssh -i your-key.pem ubuntu@your-ec2-public-ip
✅ [ssh -i .\05282026keypair.pem ubuntu@54.208.50.62]

## Step 3 — Install everything
✅ sudo apt update [36 packages can be upgraded. Run 'apt list --upgradable' to see them]
✅ sudo apt install -y stockfish python3-pip
✅ ✅ apt install python3.14-venv # [venv necessary with newer ubuntu]
✅ ✅ ubuntu@ip-172-31-28-225:~$ python3 -m venv venv
✅ ✅ ubuntu@ip-172-31-28-225:~$ source venv/bin/activate 
[TJS: Note: needed to reactivate later after any disconnect]
✅ ✅ (venv) ubuntu@ip-172-31-28-225:~$ pip install flask
✅ ✅  = not provide by claude at first 

## Step 4 — Upload and run the Flask app
bash# From your local machine, upload app.py and requirements.txt
scp -i your-key.pem app.py ubuntu@your-ec2-public-ip:

[FROM C:\Users\TJ\source\repos\chess_cafe\0527-2026]
✅ scp -i %path.keypair% .\app.py ubuntu@54.208.50.62:~/
[TJS: Note: :~/ required or false positive]

✅scp -i your-key.pem requirements.txt ubuntu@your-ec2-public-ip:~/
[TJS: Note: pip install -r requirements.txt]

#### Back on EC2, run it
gunicorn -w 2 -b 0.0.0.0:8000 app:app
[TJS: 1020am ran this but question on key right now
resolve key issue and then test with POSTMAN ?]

## Step 5 — Point Django at the API
python# Django settings.py
STOCKFISH_API_URL = "http://54.208.50.62:8000"
STOCKFISH_API_KEY = "your-strong-secret-key"

## Step 6 
There isn't really a Step 6 in the basic setup. Would you like there to be one? For example a natural next step could be:

Step 6 — Keep the app running after you close SSH (using systemd or screen)

Without that, the moment you close your SSH session the Flask app stops. Want me to add that?

## example python requests
import requests

response = requests.post(
    "http://54.208.50.62:8000/best-move",
    headers={"X-API-Key": "your-secret-key"},
    json={
        "fen": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
        "difficulty": "intermediate"
    }
)

print(response.json())

### --- expected response
{
    "best_move": "e7e5",
    "evaluation": {
        "type": "cp",
        "value": -30
    }
}

### health check no API key needed
curl http://your-ec2-public-ip:8000/health
#### {"status": "ok"}

The only EC2-specific thing here is the default STOCKFISH_PATH — it points to /usr/games/stockfish which is where sudo apt install stockfish puts it, so no path fiddling needed.

### 0528-2026 keep it running after disconnect ###
#### Run in background, detached from terminal
nohup gunicorn -w 2 -b 0.0.0.0:8000 app:app &

#### Or with a proper process manager
sudo systemctl start your-service-name

### Add logging flags to gunicorn
gunicorn -w 2 -b 0.0.0.0:8000 --access-logfile access.log --error-logfile error.log app:app
kill -HUP 4641   # Send HUP to the master PID


### Miscellaneous Tip
#### get environment var or default to 'changeme'
API_KEY = os.environ.get('STOCKFISH_API_KEY', 'changeme')
#### setting an environment key
export STOCKFISH_API_KEY="your-strong-secret-key"

#### restart gunicorn so it picks up the new value:
pkill -f gunicorn
gunicorn -w 2 -b 0.0.0.0:8000 app:app

#### restart server checklist
1. set instance state [start instance]
2. copy public IP to clipboard [changes each time]
3. update view.py with new public IP
4. ssh in with new public IP (run commands below)
source venv/bin/activate 
export STOCKFISH_API_KEY="your-strong-secret-key"
gunicorn -w 2 -b 0.0.0.0:8000 app:app
#### option to make automatic
sudo nano /etc/systemd/system/stockfish.service
###### paste below
[Unit]
Description=Stockfish API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu
Environment="STOCKFISH_API_KEY=your-secret-key"
ExecStart=/home/ubuntu/venv/bin/gunicorn -w 2 -b 0.0.0.0:8000 app:app
Restart=always

[Install]
WantedBy=multi-user.target

. Save and exit (Ctrl+X, then Y, then Enter)

#### enable and start it
sudo systemctl daemon-reload
sudo systemctl enable stockfish
sudo systemctl start stockfish
#### check if running
sudo systemctl status stockfish

#### 0529-2026-adding additional levels
DIFFICULTY_SETTINGS = {
    "novice":       {"UCI_LimitStrength": True, "UCI_Elo": 800},
    "apprentice":   {"UCI_LimitStrength": True, "UCI_Elo": 1000},
    "clubplayer":   {"UCI_LimitStrength": True, "UCI_Elo": 1200},
    "contender":    {"UCI_LimitStrength": True, "UCI_Elo": 1400},
    "rival":        {"UCI_LimitStrength": True, "UCI_Elo": 1600},
    "expert":       {"UCI_LimitStrength": True, "UCI_Elo": 1800},
    "master":       {"UCI_LimitStrength": True, "UCI_Elo": 2000},
    "grandmaster":  {"UCI_LimitStrength": True, "UCI_Elo": 2200},
    "deepblue":     {"UCI_LimitStrength": True, "UCI_Elo": 2800},
    "stockfish":    {"UCI_LimitStrength": False},
}

<div id="difficulty-btns">
    <button class="diff-btn active" data-level="novice">Novice <small>800</small></button>
    <button class="diff-btn" data-level="apprentice">Apprentice <small>1000</small></button>
    <button class="diff-btn" data-level="clubplayer">Club Player <small>1200</small></button>
    <button class="diff-btn" data-level="contender">Contender <small>1400</small></button>
    <button class="diff-btn" data-level="rival">Rival <small>1600</small></button>
    <button class="diff-btn" data-level="expert">Expert <small>1800</small></button>
    <button class="diff-btn" data-level="master">Master <small>2000</small></button>
    <button class="diff-btn" data-level="grandmaster">Grandmaster <small>2200</small></button>
    <button class="diff-btn" data-level="deepblue">Deep Blue <small>2800</small></button>
    <button class="diff-btn" data-level="stockfish">Stockfish <small>MAX</small></button>
</div>
.diff-btn small {
    display: block;
    font-size: 0.75em;
    opacity: 0.7;
}
