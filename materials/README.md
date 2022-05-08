# Materials

This folder does not contain any content requested by the application. Instead, I save materials that are used to prepare for the app assets.

## ./icons

- Pimon source https://www.pixiv.net/en/users/6657532
- For MacOS icons, the icon size should be 80% of the canvas. For example, a 512x512 icon should have a transparent background and a 410x410 icon in the center, with rounded corners. The border radius is, cited from slack overflow, 10 / 57 = 0.17544 of the icon size (that is 512 $\times$ 0.17544 = 89.82 px), and this rounded corner looks very similar to the template from apple design official website as I compare them in photoshop.
- However, the favicon and the apple-touch-icon need not to be shrinked. The apple-touch-icon will automatically get rounded corners.
- I presented favicon.ico 64x64, icon144.png, icon180.png, icon192.png, icon512.png, and linking favicon.ico as 'icon', icon180.png as 'apple-touch-icon'. Chrome tab icon turns out to be favicon, same for safari. In manifest page, the 'primary icon used by chrome' becomes icon144. Safari's 'favorite' icon was icon180, so was the icon appearing on the share menu. The icon in the share menu often is shrinked and has a white background. While I did found once the icon shows in full size. I suspect that when icon has transparency, apple shrinks it and put a white background under it, when icon's solid, it appears in full size. But I'm still not sure how to get the icon in safari's 'favorite tab' full size. When adding PWA to ios screen, it uses the icon180, same for my ipad and iphone. On MacOS, both icon in the dock and the launchpad are icon512. Opening the .app package, I found the four icons in it are icon512, icon512, icon144, favicon. I suspect the second icon512 is a resized 256x256 from icon512. In the end, not anywhere was icon192 used. Suspecting it to be useful for some android devices. But on my Motorola, the icon added to the desktop was icon144.
