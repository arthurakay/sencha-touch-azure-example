# Get the directory that this configuration file exists in
dir = File.dirname(__FILE__)

workspace = '../../../../../../../'

# Load the sencha-touch framework automatically.
load File.join(dir, workspace, '../touch/', 'resources', 'themes')

# Compass configurations
sass_path = dir
css_path = File.join(dir, "..", "css")

# Require any additional compass plugins here.
images_dir = File.join(dir, "..", "images")
output_style = :compressed
environment = :production
