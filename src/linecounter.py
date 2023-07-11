import os

def count_lines(file_path):
    with open(file_path, 'r') as file:
        return sum(1 for line in file)

def count_lines_in_current_directory():
    current_directory = os.getcwd()
    total_lines = 0

    for file_name in os.listdir(current_directory):
        file_path = os.path.join(current_directory, file_name)
        if os.path.isfile(file_path):
            total_lines += count_lines(file_path)

    return total_lines

# Usage
line_count = count_lines_in_current_directory()
print(f"Total lines in current directory: {line_count}")
