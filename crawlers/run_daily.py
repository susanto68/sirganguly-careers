"""Small dependency-free runner used by GitHub Actions to validate and trigger refreshes."""

import argparse
import json
import os
import sys
import urllib.request
from urllib.parse import urlparse

from sources import SOURCES


def validate_sources() -> None:
    seen = set()
    for source in SOURCES:
        parsed = urlparse(source["url"])
        if parsed.scheme != "https" or not parsed.netloc:
            raise ValueError(f"Invalid HTTPS source: {source['name']}")
        key = (source["name"].lower(), parsed.netloc.lower())
        if key in seen:
            raise ValueError(f"Duplicate source: {source['name']}")
        seen.add(key)
    print(json.dumps({"status": "valid", "official_sources": len(SOURCES)}))


def trigger_refresh() -> None:
    site_url = os.environ.get("CAREER_SITE_URL", "").rstrip("/")
    secret = os.environ.get("CRON_SECRET", "")
    if not site_url or not secret:
        raise RuntimeError("CAREER_SITE_URL and CRON_SECRET GitHub secrets are required")
    request = urllib.request.Request(
        f"{site_url}/api/cron/daily-refresh",
        headers={"x-cron-secret": secret, "user-agent": "CareerTrustAI-GitHub-Actions/1.0"},
    )
    with urllib.request.urlopen(request, timeout=55) as response:
        payload = response.read().decode("utf-8")
        print(payload)
        if response.status != 200:
            raise RuntimeError(f"Refresh failed with HTTP {response.status}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--validate-only", action="store_true")
    parser.add_argument("--trigger", action="store_true")
    args = parser.parse_args()
    try:
        validate_sources()
        if args.trigger:
            trigger_refresh()
    except Exception as error:
        print(json.dumps({"status": "failed", "error": str(error)}), file=sys.stderr)
        raise SystemExit(1)

