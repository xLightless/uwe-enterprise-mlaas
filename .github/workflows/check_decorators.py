import os
import re
import sys


def check_lines(lines):
    """
    Check a list of lines for bad route naming
    """
    bad_routes = []
    for line in lines:
        # Check if the line is a decorator
        # and if it contains the word "route"
        if not line.strip().startswith('@') or "route" not in line:
            continue

        # Extract the route from the line to get '/get_route_data'
        route = re.search(
            r"@.*route\(['\"](.*?)['\"]",
            line
        ).group(1).strip()

        if '_' not in route:
            continue

        # An exception is: /route/<int:route_id>
        # Get index of underscore
        underscore_index = route.find('_')

        # Back track, if we find a slash then it's not good
        # Otherwise, it's a parameter
        for i in range(underscore_index - 1, -1, -1):
            if route[i] == '/':
                bad_routes.append(route)
            if route[i] == '<':
                break

    return bad_routes


def check_file(file):
    """
    Examine a specific file for bad route naming
    """
    with open(file, 'r', encoding="utf8") as f:
        lines = f.readlines()
        bad_routes = check_lines(lines)

        return bad_routes


def check_files():
    """
    Check all python files in all directories
    """
    bad_files = []

    for root, _, files in os.walk("."):
        for file in files:
            if not file.endswith('.py') or file in ['check_decorators.py']:
                continue

            bad_routes = check_file(os.path.join(root, file))
            if len(bad_routes) > 0:
                path = os.path.join(root, file)
                for route in bad_routes:
                    bad_files.append(f"{path} - {route}")

    return bad_files


if __name__ == "__main__":
    bad_lines = check_files()

    if len(bad_lines) > 0:
        for bad_file in bad_lines:
            print(f"Underscore found in {bad_file}")
        sys.exit(1)