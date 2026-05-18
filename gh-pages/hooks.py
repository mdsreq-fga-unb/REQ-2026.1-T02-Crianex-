def on_post_page(output, page, config, **kwargs):
    depth = len([p for p in page.url.split('/') if p])
    prefix = '../' * depth
    tag = f'<link rel="shortcut icon" type="image/png" href="{prefix}assets/logo.png">\n'
    return output.replace('</head>', tag + '</head>', 1)
