.
├── CLAUDE.md
├── README.md
├── e2e
│   ├── GUIDE.md
│   ├── tsconfig.json
│   └── vue.spec.ts
├── env.d.ts
├── eslint.config.ts
├── index.html
├── package.json
├── playwright.config.ts
├── scripts
│   └── rename-extensions.mjs
├── src
│   ├── App.vue
│   ├── __tests__
│   │   ├── App.spec.ts
│   │   ├── GUIDE.md
│   │   └── unit
│   │       ├── api-rage.spec.ts
│   │       └── router-store.spec.ts
│   ├── api
│   │   ├── formatter.ts
│   │   ├── functions.ts
│   │   └── rage.ts
│   ├── components
│   │   ├── animcontainer
│   │   │   ├── animcontainer.component.vue
│   │   │   └── main.scss
│   │   ├── fadecontainer
│   │   │   ├── fadecontainer.component.vue
│   │   │   └── main.scss
│   │   ├── filterblur
│   │   │   ├── filterblur.component.vue
│   │   │   └── main.scss
│   │   ├── input
│   │   │   ├── input.component.vue
│   │   │   ├── main.scss
│   │   │   └── oneInput.vue
│   │   ├── keyAnimation
│   │   │   ├── keyAnimation.component.vue
│   │   │   └── main.scss
│   │   ├── notification
│   │   │   ├── main.scss
│   │   │   └── notification.component.vue
│   │   ├── popuscontainer
│   │   │   ├── main.scss
│   │   │   └── popups.container.component.vue
│   │   ├── sortlist
│   │   │   ├── main.scss
│   │   │   └── sortlist.component.vue
│   │   ├── ui
│   │   │   ├── IosButton.vue
│   │   │   ├── IosCard.vue
│   │   │   ├── IosCheckbox.vue
│   │   │   ├── IosListItem.vue
│   │   │   └── index.ts
│   │   ├── uifilter
│   │   │   ├── img
│   │   │   │   ├── bg-filter.png
│   │   │   │   ├── bg-shadow.png
│   │   │   │   └── bg-smoke.png
│   │   │   ├── main.scss
│   │   │   └── uifilter.component.vue
│   │   └── viewcontainer
│   │       ├── main.scss
│   │       └── viewcontainer.component.vue
│   ├── dev
│   │   └── mp-mock.ts
│   ├── enums
│   │   ├── business.d.ts
│   │   ├── character_appearance.d.ts
│   │   ├── character_gender.d.ts
│   │   ├── character_vip.d.ts
│   │   ├── house.d.ts
│   │   └── in-game-item.d.ts
│   ├── json
│   │   ├── animations.ts
│   │   ├── clothes
│   │   │   ├── barber_Female_Beard.json
│   │   │   ├── barber_Female_Body.json
│   │   │   ├── barber_Female_Eyebrows.json
│   │   │   ├── barber_Female_Eyes.json
│   │   │   ├── barber_Female_Hair.json
│   │   │   ├── barber_Female_Lips.json
│   │   │   ├── barber_Female_Makeup.json
│   │   │   ├── barber_Female_Palette.json
│   │   │   ├── barber_Male_Beard.json
│   │   │   ├── barber_Male_Body.json
│   │   │   ├── barber_Male_Eyebrows.json
│   │   │   ├── barber_Male_Eyes.json
│   │   │   ├── barber_Male_Hair.json
│   │   │   ├── barber_Male_Lips.json
│   │   │   ├── barber_Male_Makeup.json
│   │   │   ├── barber_Male_Palette.json
│   │   │   ├── clothes_Bugs.json
│   │   │   ├── clothes_Female_Accessories.json
│   │   │   ├── clothes_Female_BodyArmors.json
│   │   │   ├── clothes_Female_Bracelets.json
│   │   │   ├── clothes_Female_Decals.json
│   │   │   ├── clothes_Female_Ears.json
│   │   │   ├── clothes_Female_Glasses.json
│   │   │   ├── clothes_Female_Hats.json
│   │   │   ├── clothes_Female_Legs.json
│   │   │   ├── clothes_Female_Masks.json
│   │   │   ├── clothes_Female_Shoes.json
│   │   │   ├── clothes_Female_Tops.json
│   │   │   ├── clothes_Female_Torsos.json
│   │   │   ├── clothes_Female_Undershort.json
│   │   │   ├── clothes_Female_Watches.json
│   │   │   ├── clothes_Male_Accessories.json
│   │   │   ├── clothes_Male_BodyArmors.json
│   │   │   ├── clothes_Male_Bracelets.json
│   │   │   ├── clothes_Male_Decals.json
│   │   │   ├── clothes_Male_Ears.json
│   │   │   ├── clothes_Male_Glasses.json
│   │   │   ├── clothes_Male_Hats.json
│   │   │   ├── clothes_Male_Legs.json
│   │   │   ├── clothes_Male_Masks.json
│   │   │   ├── clothes_Male_Shoes.json
│   │   │   ├── clothes_Male_Tops.json
│   │   │   ├── clothes_Male_Torsos.json
│   │   │   ├── clothes_Male_Undershort.json
│   │   │   ├── clothes_Male_Watches.json
│   │   │   ├── clothes_Masks.json
│   │   │   ├── itemsInfo.ts
│   │   │   ├── tattoo_Head.json
│   │   │   ├── tattoo_LeftArm.json
│   │   │   ├── tattoo_LeftLeg.json
│   │   │   ├── tattoo_RightArm.json
│   │   │   ├── tattoo_RightLeg.json
│   │   │   └── tattoo_Torso.json
│   │   ├── clothes.ts
│   │   ├── commands.ts
│   │   ├── fracconfigaccesses.ts
│   │   ├── fraction.ts
│   │   ├── fractionToCommand.ts
│   │   ├── inventoryweapons.ts
│   │   ├── jobs.ts
│   │   ├── keys.ts
│   │   ├── quests
│   │   │   ├── ValentineDay
│   │   │   │   ├── npc_doctor.json
│   │   │   │   ├── npc_granny.json
│   │   │   │   └── npc_tracy.json
│   │   │   ├── biz
│   │   │   │   ├── npc_furniture.json
│   │   │   │   ├── npc_pet.json
│   │   │   │   ├── npc_petshop.json
│   │   │   │   ├── npc_premium.json
│   │   │   │   └── npc_rieltor.json
│   │   │   ├── defenderFatherlandDay
│   │   │   │   ├── npc_dada.json
│   │   │   │   ├── npc_pavel.json
│   │   │   │   └── npc_zak.json
│   │   │   ├── fraction
│   │   │   │   ├── npc_fracems.json
│   │   │   │   ├── npc_fracnews.json
│   │   │   │   ├── npc_fracpolic.json
│   │   │   │   └── npc_fracsheriff.json
│   │   │   ├── npc_airdrop.json
│   │   │   ├── npc_airshop.json
│   │   │   ├── npc_birthday.json
│   │   │   ├── npc_carevac.json
│   │   │   ├── npc_cityhall.json
│   │   │   ├── npc_donateautoroom.json
│   │   │   ├── npc_eliteroom.json
│   │   │   ├── npc_huntingshop.json
│   │   │   ├── npc_oressale.json
│   │   │   ├── npc_org.json
│   │   │   ├── npc_stock.json
│   │   │   ├── npc_tailer.json
│   │   │   ├── npc_treessell.json
│   │   │   ├── npc_wedding.json
│   │   │   ├── npc_zdobich.json
│   │   │   ├── npc_zdobich1.json
│   │   │   ├── quests.ts
│   │   │   └── work
│   │   │       ├── npc_automechanic.json
│   │   │       ├── npc_bus.json
│   │   │       ├── npc_collector.json
│   │   │       ├── npc_electrician.json
│   │   │       ├── npc_gopostal.json
│   │   │       ├── npc_lawnmower.json
│   │   │       ├── npc_taxi.json
│   │   │       └── npc_truckers.json
│   │   └── tips.ts
│   ├── lang
│   │   ├── en
│   │   │   └── admin
│   │   │       └── mini
│   │   ├── index.ts
│   │   ├── ru
│   │   └── ua
│   ├── main.ts
│   ├── models
│   │   └── prisma
│   │       ├── client.d.ts
│   │       ├── client.js
│   │       ├── default.d.ts
│   │       ├── default.js
│   │       ├── edge.d.ts
│   │       ├── edge.js
│   │       ├── index-browser.js
│   │       ├── index.d.ts
│   │       ├── index.js
│   │       ├── package.json
│   │       ├── query_compiler_fast_bg.js
│   │       ├── query_compiler_fast_bg.wasm
│   │       ├── query_compiler_fast_bg.wasm-base64.js
│   │       ├── runtime
│   │       │   ├── client.d.ts
│   │       │   ├── client.js
│   │       │   ├── index-browser.d.ts
│   │       │   ├── index-browser.js
│   │       │   └── wasm-compiler-edge.js
│   │       ├── schema.prisma
│   │       ├── wasm-edge-light-loader.mjs
│   │       └── wasm-worker-loader.mjs
│   ├── popups
│   │   ├── camera
│   │   │   ├── camera.popup.vue
│   │   │   ├── images
│   │   │   │   ├── mouse.png
│   │   │   │   ├── mouse__middle.png
│   │   │   │   ├── mouse_back.png
│   │   │   │   └── photo.png
│   │   │   └── main.scss
│   │   ├── circle
│   │   │   ├── assets
│   │   │   │   ├── css
│   │   │   │   │   ├── circle.scss
│   │   │   │   │   ├── fonts
│   │   │   │   │   │   ├── circle.eot
│   │   │   │   │   │   ├── circle.svg
│   │   │   │   │   │   ├── circle.ttf
│   │   │   │   │   │   └── circle.woff
│   │   │   │   │   └── iconscircle.css
│   │   │   │   └── images
│   │   │   │       ├── border_circle.svg
│   │   │   │       ├── mouse.png
│   │   │   │       └── mouse_back.png
│   │   │   └── circle.popup.vue
│   │   ├── confirm
│   │   │   ├── confirm.popup.vue
│   │   │   ├── hospital.confirm.popup.vue
│   │   │   └── main.scss
│   │   ├── death
│   │   │   ├── death.popup.vue
│   │   │   └── main.scss
│   │   ├── donate
│   │   │   ├── donate.popup.vue
│   │   │   ├── images
│   │   │   │   ├── bitcoin.png
│   │   │   │   ├── delete-header.png
│   │   │   │   ├── donate-back.png
│   │   │   │   ├── donate-header.png
│   │   │   │   └── logo.png
│   │   │   └── main.scss
│   │   ├── input
│   │   │   ├── input.popup.vue
│   │   │   └── main.scss
│   │   ├── main
│   │   │   ├── main.popup.vue
│   │   │   └── main.scss
│   │   ├── roulette
│   │   │   ├── images
│   │   │   │   └── symbol.png
│   │   │   ├── main.scss
│   │   │   ├── popupprise.vue
│   │   │   └── roulette.popup.vue
│   │   ├── select
│   │   │   ├── main.scss
│   │   │   └── select.popup.vue
│   │   ├── upgrade
│   │   │   ├── main.scss
│   │   │   ├── upgrade.png
│   │   │   └── upgrade.popup.vue
│   │   └── war
│   │       ├── data.ts
│   │       ├── image.png
│   │       ├── main.scss
│   │       └── war.popup.vue
│   ├── router
│   │   └── index.ts
│   ├── stores
│   │   ├── counter.ts
│   │   ├── laptop.ts
│   │   ├── phone.ts
│   │   ├── router.ts
│   │   └── tablet.ts
│   ├── validators
│   │   └── account.validator.ts
│   └── views
│       ├── accessories
│       │   ├── laptop
│       │   │   ├── Laptop.vue
│       │   │   ├── assets
│       │   │   │   ├── bezel
│       │   │   │   │   ├── MacBook Pro M5 16-inch Silver.png
│       │   │   │   │   └── MacBook Pro M5 16-inch Space Black.png
│       │   │   │   ├── icons
│       │   │   │   │   └── apps
│       │   │   │   │       └── launchpad
│       │   │   │   │           ├── dark.png
│       │   │   │   │           └── light.png
│       │   │   │   └── wallpapers
│       │   │   │       ├── 465563.jpg
│       │   │   │       └── 465566.jpg
│       │   │   ├── components
│       │   │   │   ├── auction
│       │   │   │   │   └── AuctionApp.vue
│       │   │   │   ├── camera
│       │   │   │   │   └── CameraApp.vue
│       │   │   │   ├── cars
│       │   │   │   │   └── CarsApp.vue
│       │   │   │   ├── desktop
│       │   │   │   │   ├── MacDesktop.vue
│       │   │   │   │   ├── MacDock.vue
│       │   │   │   │   └── MacMenuBar.vue
│       │   │   │   ├── forbes
│       │   │   │   │   └── ForbesApp.vue
│       │   │   │   ├── gallery
│       │   │   │   │   └── GalleryApp.vue
│       │   │   │   ├── gps
│       │   │   │   │   └── GpsApp.vue
│       │   │   │   ├── launchpad
│       │   │   │   │   └── MacLaunchpad.vue
│       │   │   │   ├── mech
│       │   │   │   │   └── MechApp.vue
│       │   │   │   ├── messages
│       │   │   │   │   └── MessagesApp.vue
│       │   │   │   ├── news
│       │   │   │   │   └── NewsApp.vue
│       │   │   │   ├── property
│       │   │   │   │   └── PropertyApp.vue
│       │   │   │   ├── radio
│       │   │   │   │   └── RadioApp.vue
│       │   │   │   ├── settings
│       │   │   │   │   └── SettingsApp.vue
│       │   │   │   ├── taxi
│       │   │   │   │   └── TaxiApp.vue
│       │   │   │   ├── tinder
│       │   │   │   │   └── TinderApp.vue
│       │   │   │   ├── trucker
│       │   │   │   │   └── TruckerApp.vue
│       │   │   │   ├── weather
│       │   │   │   │   └── WeatherApp.vue
│       │   │   │   └── window
│       │   │   │       └── MacWindow.vue
│       │   │   └── laptop.scss
│       │   ├── phone
│       │   │   ├── Phone.vue
│       │   │   ├── assets
│       │   │   │   ├── bezel
│       │   │   │   │   ├── iPhone 17 Pro Max - Cosmic Orange - Portrait.png
│       │   │   │   │   ├── iPhone 17 Pro Max - Deep Blue - Portrait.png
│       │   │   │   │   └── iPhone 17 Pro Max - Silver - Portrait.png
│       │   │   │   ├── fonts
│       │   │   │   │   ├── phoneicons
│       │   │   │   │   │   └── style.css
│       │   │   │   │   └── phonesmiles
│       │   │   │   │       ├── fonts
│       │   │   │   │       └── style.css
│       │   │   │   ├── images
│       │   │   │   │   ├── addcontact.png
│       │   │   │   │   ├── auction.png
│       │   │   │   │   ├── auction_pers.png
│       │   │   │   │   ├── avito.png
│       │   │   │   │   ├── background1.png
│       │   │   │   │   ├── call.png
│       │   │   │   │   ├── camera.png
│       │   │   │   │   ├── cameraphoto.png
│       │   │   │   │   ├── check.svg
│       │   │   │   │   ├── darknet.png
│       │   │   │   │   ├── filter.svg
│       │   │   │   │   ├── forbes.png
│       │   │   │   │   ├── forbesicon.png
│       │   │   │   │   ├── gallery.png
│       │   │   │   │   ├── gift.png
│       │   │   │   │   ├── headphones.png
│       │   │   │   │   ├── heal.png
│       │   │   │   │   ├── hidden.svg
│       │   │   │   │   ├── house.png
│       │   │   │   │   ├── mainmenu__weather
│       │   │   │   │   │   ├── cloud.png
│       │   │   │   │   │   ├── fog.png
│       │   │   │   │   │   ├── night.png
│       │   │   │   │   │   ├── nightcloud.png
│       │   │   │   │   │   ├── nightfog.png
│       │   │   │   │   │   ├── nightrain.png
│       │   │   │   │   │   ├── nightsnow.png
│       │   │   │   │   │   ├── nightthunder.png
│       │   │   │   │   │   ├── rain.png
│       │   │   │   │   │   ├── snow.png
│       │   │   │   │   │   ├── sunny.png
│       │   │   │   │   │   └── thunder.png
│       │   │   │   │   ├── map.jpg
│       │   │   │   │   ├── map_dark.png
│       │   │   │   │   ├── maps.png
│       │   │   │   │   ├── mech.png
│       │   │   │   │   ├── mechcar.png
│       │   │   │   │   ├── messages.png
│       │   │   │   │   ├── news.png
│       │   │   │   │   ├── newsicon.png
│       │   │   │   │   ├── nonerent.png
│       │   │   │   │   ├── notification.png
│       │   │   │   │   ├── person.png
│       │   │   │   │   ├── property.png
│       │   │   │   │   ├── propertyicon.png
│       │   │   │   │   ├── radio.png
│       │   │   │   │   ├── radioicon.png
│       │   │   │   │   ├── reload.svg
│       │   │   │   │   ├── rent.png
│       │   │   │   │   ├── renticon.png
│       │   │   │   │   ├── selected__image.png
│       │   │   │   │   ├── settings.png
│       │   │   │   │   ├── shop.png
│       │   │   │   │   ├── signal.png
│       │   │   │   │   ├── social.png
│       │   │   │   │   ├── sound.png
│       │   │   │   │   ├── sounds.png
│       │   │   │   │   ├── taxi.png
│       │   │   │   │   ├── taxicar.png
│       │   │   │   │   ├── tinder.png
│       │   │   │   │   ├── truckcar.png
│       │   │   │   │   ├── trucker.png
│       │   │   │   │   ├── tumbleweed.png
│       │   │   │   │   ├── wallpaper.png
│       │   │   │   │   ├── weather
│       │   │   │   │   │   ├── cloud.png
│       │   │   │   │   │   ├── cloud_small.png
│       │   │   │   │   │   ├── fog.png
│       │   │   │   │   │   ├── fog_small.png
│       │   │   │   │   │   ├── moon.png
│       │   │   │   │   │   ├── moon_small.png
│       │   │   │   │   │   ├── moon_small_cloud.png
│       │   │   │   │   │   ├── moon_small_fog.png
│       │   │   │   │   │   ├── moon_small_rain.png
│       │   │   │   │   │   ├── moon_small_snow.png
│       │   │   │   │   │   ├── moon_small_thunder.png
│       │   │   │   │   │   ├── mooncloud.png
│       │   │   │   │   │   ├── moonfog.png
│       │   │   │   │   │   ├── moonrain.png
│       │   │   │   │   │   ├── moonsnow.png
│       │   │   │   │   │   ├── moonthunder.png
│       │   │   │   │   │   ├── rain.png
│       │   │   │   │   │   ├── rain_small.png
│       │   │   │   │   │   ├── snow.png
│       │   │   │   │   │   ├── snow_small.png
│       │   │   │   │   │   ├── sun.png
│       │   │   │   │   │   ├── sun_small.png
│       │   │   │   │   │   ├── thunder.png
│       │   │   │   │   │   └── thunder_small.png
│       │   │   │   │   └── weather.png
│       │   │   │   └── wallpapers
│       │   │   │       ├── iClarified-iPhone17-Black-Homescreen.jpg
│       │   │   │       ├── iClarified-iPhone17-Black-Lockscreen.jpg
│       │   │   │       ├── iClarified-iPhone17-Lavender-Homescreen.jpg
│       │   │   │       ├── iClarified-iPhone17-Lavender-Lockscreen.jpg
│       │   │   │       ├── iClarified-iPhone17-MistBlue-Homescreen.jpg
│       │   │   │       ├── iClarified-iPhone17-MistBlue-Lockscreen.jpg
│       │   │   │       ├── iClarified-iPhone17-Sage-Homescreen.jpg
│       │   │   │       ├── iClarified-iPhone17-Sage-Lockscreen.jpg
│       │   │   │       ├── iClarified-iPhone17-White-Homescreen.jpg
│       │   │   │       ├── iClarified-iPhone17-White-Lockscreen.jpg
│       │   │   │       ├── iClarified-iPhone17Pro-CosmicOrange-Homescreen.jpg
│       │   │   │       ├── iClarified-iPhone17Pro-CosmicOrange-Lockscreen.jpg
│       │   │   │       ├── iClarified-iPhone17Pro-DeepBlue-Homescreen.jpg
│       │   │   │       ├── iClarified-iPhone17Pro-DeepBlue-Lockscreen.jpg
│       │   │   │       ├── iClarified-iPhone17Pro-Silver-Homescreen.jpg
│       │   │   │       └── iClarified-iPhone17Pro-Silver-Lockscreen.jpg
│       │   │   ├── components
│       │   │   │   ├── PhoneHeader.vue
│       │   │   │   ├── PhoneHomeButton.vue
│       │   │   │   ├── PhoneNotification.vue
│       │   │   │   ├── PhoneWallpaper.vue
│       │   │   │   ├── auction
│       │   │   │   │   └── AuctionApp.vue
│       │   │   │   ├── calls
│       │   │   │   │   ├── AddContact.vue
│       │   │   │   │   ├── CallApp.vue
│       │   │   │   │   ├── CallView.vue
│       │   │   │   │   ├── ContactsList.vue
│       │   │   │   │   ├── DialPad.vue
│       │   │   │   │   ├── RecentCalls.vue
│       │   │   │   │   └── SelectContact.vue
│       │   │   │   ├── camera
│       │   │   │   │   └── CameraApp.vue
│       │   │   │   ├── cars
│       │   │   │   │   └── CarsApp.vue
│       │   │   │   ├── forbes
│       │   │   │   │   └── ForbesApp.vue
│       │   │   │   ├── gallery
│       │   │   │   │   ├── GalleryApp.vue
│       │   │   │   │   └── GalleryPopup.vue
│       │   │   │   ├── gps
│       │   │   │   │   ├── GpsApp.vue
│       │   │   │   │   └── PhoneMap.vue
│       │   │   │   ├── mainmenu
│       │   │   │   │   ├── MainMenu.vue
│       │   │   │   │   ├── WeatherWidget.vue
│       │   │   │   │   └── mainmenu.scss
│       │   │   │   ├── mech
│       │   │   │   │   └── MechApp.vue
│       │   │   │   ├── messages
│       │   │   │   │   ├── EmojiPicker.vue
│       │   │   │   │   ├── MessageChat.vue
│       │   │   │   │   ├── MessagesApp.vue
│       │   │   │   │   └── MessagesList.vue
│       │   │   │   ├── news
│       │   │   │   │   └── NewsApp.vue
│       │   │   │   ├── property
│       │   │   │   │   └── PropertyApp.vue
│       │   │   │   ├── radio
│       │   │   │   │   └── RadioApp.vue
│       │   │   │   ├── settings
│       │   │   │   │   └── SettingsApp.vue
│       │   │   │   ├── taxi
│       │   │   │   │   └── TaxiApp.vue
│       │   │   │   ├── tinder
│       │   │   │   │   └── TinderApp.vue
│       │   │   │   ├── trucker
│       │   │   │   │   └── TruckerApp.vue
│       │   │   │   └── weather
│       │   │   │       └── WeatherApp.vue
│       │   │   └── phone.scss
│       │   ├── shared
│       │   │   ├── apps
│       │   │   ├── assets
│       │   │   │   ├── fonts
│       │   │   │   │   ├── NewYork
│       │   │   │   │   │   ├── NewYorkExtraLarge-Black.otf
│       │   │   │   │   │   ├── NewYorkExtraLarge-BlackItalic.otf
│       │   │   │   │   │   ├── NewYorkExtraLarge-Bold.otf
│       │   │   │   │   │   ├── NewYorkExtraLarge-BoldItalic.otf
│       │   │   │   │   │   ├── NewYorkExtraLarge-Heavy.otf
│       │   │   │   │   │   ├── NewYorkExtraLarge-HeavyItalic.otf
│       │   │   │   │   │   ├── NewYorkExtraLarge-Medium.otf
│       │   │   │   │   │   ├── NewYorkExtraLarge-MediumItalic.otf
│       │   │   │   │   │   ├── NewYorkExtraLarge-Regular.otf
│       │   │   │   │   │   ├── NewYorkExtraLarge-RegularItalic.otf
│       │   │   │   │   │   ├── NewYorkExtraLarge-Semibold.otf
│       │   │   │   │   │   ├── NewYorkExtraLarge-SemiboldItalic.otf
│       │   │   │   │   │   ├── NewYorkLarge-Black.otf
│       │   │   │   │   │   ├── NewYorkLarge-BlackItalic.otf
│       │   │   │   │   │   ├── NewYorkLarge-Bold.otf
│       │   │   │   │   │   ├── NewYorkLarge-BoldItalic.otf
│       │   │   │   │   │   ├── NewYorkLarge-Heavy.otf
│       │   │   │   │   │   ├── NewYorkLarge-HeavyItalic.otf
│       │   │   │   │   │   ├── NewYorkLarge-Medium.otf
│       │   │   │   │   │   ├── NewYorkLarge-MediumItalic.otf
│       │   │   │   │   │   ├── NewYorkLarge-Regular.otf
│       │   │   │   │   │   ├── NewYorkLarge-RegularItalic.otf
│       │   │   │   │   │   ├── NewYorkLarge-Semibold.otf
│       │   │   │   │   │   ├── NewYorkLarge-SemiboldItalic.otf
│       │   │   │   │   │   ├── NewYorkMedium-Black.otf
│       │   │   │   │   │   ├── NewYorkMedium-BlackItalic.otf
│       │   │   │   │   │   ├── NewYorkMedium-Bold.otf
│       │   │   │   │   │   ├── NewYorkMedium-BoldItalic.otf
│       │   │   │   │   │   ├── NewYorkMedium-Heavy.otf
│       │   │   │   │   │   ├── NewYorkMedium-HeavyItalic.otf
│       │   │   │   │   │   ├── NewYorkMedium-Medium.otf
│       │   │   │   │   │   ├── NewYorkMedium-MediumItalic.otf
│       │   │   │   │   │   ├── NewYorkMedium-Regular.otf
│       │   │   │   │   │   ├── NewYorkMedium-RegularItalic.otf
│       │   │   │   │   │   ├── NewYorkMedium-Semibold.otf
│       │   │   │   │   │   ├── NewYorkMedium-SemiboldItalic.otf
│       │   │   │   │   │   ├── NewYorkSmall-Black.otf
│       │   │   │   │   │   ├── NewYorkSmall-BlackItalic.otf
│       │   │   │   │   │   ├── NewYorkSmall-Bold.otf
│       │   │   │   │   │   ├── NewYorkSmall-BoldItalic.otf
│       │   │   │   │   │   ├── NewYorkSmall-Heavy.otf
│       │   │   │   │   │   ├── NewYorkSmall-HeavyItalic.otf
│       │   │   │   │   │   ├── NewYorkSmall-Medium.otf
│       │   │   │   │   │   ├── NewYorkSmall-MediumItalic.otf
│       │   │   │   │   │   ├── NewYorkSmall-Regular.otf
│       │   │   │   │   │   ├── NewYorkSmall-RegularItalic.otf
│       │   │   │   │   │   ├── NewYorkSmall-Semibold.otf
│       │   │   │   │   │   └── NewYorkSmall-SemiboldItalic.otf
│       │   │   │   │   └── SF-Pro
│       │   │   │   │       ├── SF-Pro-Display-Black.otf
│       │   │   │   │       ├── SF-Pro-Display-BlackItalic.otf
│       │   │   │   │       ├── SF-Pro-Display-Bold.otf
│       │   │   │   │       ├── SF-Pro-Display-BoldItalic.otf
│       │   │   │   │       ├── SF-Pro-Display-Heavy.otf
│       │   │   │   │       ├── SF-Pro-Display-HeavyItalic.otf
│       │   │   │   │       ├── SF-Pro-Display-Light.otf
│       │   │   │   │       ├── SF-Pro-Display-LightItalic.otf
│       │   │   │   │       ├── SF-Pro-Display-Medium.otf
│       │   │   │   │       ├── SF-Pro-Display-MediumItalic.otf
│       │   │   │   │       ├── SF-Pro-Display-Regular.otf
│       │   │   │   │       ├── SF-Pro-Display-RegularItalic.otf
│       │   │   │   │       ├── SF-Pro-Display-Semibold.otf
│       │   │   │   │       ├── SF-Pro-Display-SemiboldItalic.otf
│       │   │   │   │       ├── SF-Pro-Display-Thin.otf
│       │   │   │   │       ├── SF-Pro-Display-ThinItalic.otf
│       │   │   │   │       ├── SF-Pro-Display-Ultralight.otf
│       │   │   │   │       ├── SF-Pro-Display-UltralightItalic.otf
│       │   │   │   │       ├── SF-Pro-Italic.ttf
│       │   │   │   │       ├── SF-Pro-Rounded-Black.otf
│       │   │   │   │       ├── SF-Pro-Rounded-Bold.otf
│       │   │   │   │       ├── SF-Pro-Rounded-Heavy.otf
│       │   │   │   │       ├── SF-Pro-Rounded-Light.otf
│       │   │   │   │       ├── SF-Pro-Rounded-Medium.otf
│       │   │   │   │       ├── SF-Pro-Rounded-Regular.otf
│       │   │   │   │       ├── SF-Pro-Rounded-Semibold.otf
│       │   │   │   │       ├── SF-Pro-Rounded-Thin.otf
│       │   │   │   │       ├── SF-Pro-Rounded-Ultralight.otf
│       │   │   │   │       ├── SF-Pro-Text-Black.otf
│       │   │   │   │       ├── SF-Pro-Text-BlackItalic.otf
│       │   │   │   │       ├── SF-Pro-Text-Bold.otf
│       │   │   │   │       ├── SF-Pro-Text-BoldItalic.otf
│       │   │   │   │       ├── SF-Pro-Text-Heavy.otf
│       │   │   │   │       ├── SF-Pro-Text-HeavyItalic.otf
│       │   │   │   │       ├── SF-Pro-Text-Light.otf
│       │   │   │   │       ├── SF-Pro-Text-LightItalic.otf
│       │   │   │   │       ├── SF-Pro-Text-Medium.otf
│       │   │   │   │       ├── SF-Pro-Text-MediumItalic.otf
│       │   │   │   │       ├── SF-Pro-Text-Regular.otf
│       │   │   │   │       ├── SF-Pro-Text-RegularItalic.otf
│       │   │   │   │       ├── SF-Pro-Text-Semibold.otf
│       │   │   │   │       ├── SF-Pro-Text-SemiboldItalic.otf
│       │   │   │   │       ├── SF-Pro-Text-Thin.otf
│       │   │   │   │       ├── SF-Pro-Text-ThinItalic.otf
│       │   │   │   │       ├── SF-Pro-Text-Ultralight.otf
│       │   │   │   │       ├── SF-Pro-Text-UltralightItalic.otf
│       │   │   │   │       └── SF-Pro.ttf
│       │   │   │   ├── gta
│       │   │   │   │   └── gta_map_8k.png
│       │   │   │   └── icons
│       │   │   │       ├── apps
│       │   │   │       │   ├── appstore
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── auction
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── browser
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── camera
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── estate
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── forbes
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── maps
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── messages
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── news
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── phone
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── photos
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── rental
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── settings
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── support
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── taxi
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   ├── trucker
│       │   │   │       │   │   ├── dark.png
│       │   │   │       │   │   └── light.png
│       │   │   │       │   └── weather
│       │   │   │       │       ├── dark.png
│       │   │   │       │       └── light.png
│       │   │   │       └── system
│       │   │   │           ├── battery.75percent.png
│       │   │   │           ├── map.png
│       │   │   │           ├── mappin.and.ellipse.png
│       │   │   │           ├── moon.fill.png
│       │   │   │           └── personalhotspot.png
│       │   │   ├── components
│       │   │   │   ├── AppButton.vue
│       │   │   │   ├── AppNotification.vue
│       │   │   │   ├── AppPageControl.vue
│       │   │   │   ├── AppSegmentedControl.vue
│       │   │   │   ├── AppSlider.vue
│       │   │   │   ├── AppStepper.vue
│       │   │   │   ├── AppTabBar.vue
│       │   │   │   ├── AppTextField.vue
│       │   │   │   ├── AppToggle.vue
│       │   │   │   └── AppWidget.vue
│       │   │   ├── composables
│       │   │   │   ├── useAddContact.ts
│       │   │   │   ├── useAuction.ts
│       │   │   │   ├── useCallView.ts
│       │   │   │   ├── useCamera.ts
│       │   │   │   ├── useCars.ts
│       │   │   │   ├── useContactsList.ts
│       │   │   │   ├── useDevice.ts
│       │   │   │   ├── useDialPad.ts
│       │   │   │   ├── useForbes.ts
│       │   │   │   ├── useGallery.ts
│       │   │   │   ├── useGps.ts
│       │   │   │   ├── useMech.ts
│       │   │   │   ├── useMessageChat.ts
│       │   │   │   ├── useMessagesList.ts
│       │   │   │   ├── useNews.ts
│       │   │   │   ├── usePosition.ts
│       │   │   │   ├── useProperty.ts
│       │   │   │   ├── useRadio.ts
│       │   │   │   ├── useRecentCalls.ts
│       │   │   │   ├── useSelectContact.ts
│       │   │   │   ├── useSettings.ts
│       │   │   │   ├── useTaxi.ts
│       │   │   │   ├── useTinder.ts
│       │   │   │   ├── useTrucker.ts
│       │   │   │   └── useWeather.ts
│       │   │   └── types
│       │   │       ├── auction.ts
│       │   │       ├── calls.ts
│       │   │       ├── cars.ts
│       │   │       ├── device.ts
│       │   │       ├── forbes.ts
│       │   │       ├── gallery.ts
│       │   │       ├── mech.ts
│       │   │       ├── messages.ts
│       │   │       ├── news.ts
│       │   │       ├── position.ts
│       │   │       ├── property.ts
│       │   │       ├── taxi.ts
│       │   │       ├── tinder.ts
│       │   │       ├── trucker.ts
│       │   │       └── weather.ts
│       │   ├── tablet
│       │   │   ├── Tablet.vue
│       │   │   ├── assets
│       │   │   │   ├── bezel
│       │   │   │   │   ├── iPad Pro (M5) 13" - Silver - Landscape.png
│       │   │   │   │   └── iPad Pro (M5) 13" - Space Black - Landscape.png
│       │   │   │   └── wallpapers
│       │   │   │       └── wallpaper-official.jpg
│       │   │   ├── components
│       │   │   │   ├── TabletHeader.vue
│       │   │   │   ├── TabletWallpaper.vue
│       │   │   │   ├── auction
│       │   │   │   │   └── AuctionApp.vue
│       │   │   │   ├── cars
│       │   │   │   │   └── CarsApp.vue
│       │   │   │   ├── forbes
│       │   │   │   │   └── ForbesApp.vue
│       │   │   │   ├── gallery
│       │   │   │   │   └── GalleryApp.vue
│       │   │   │   ├── gps
│       │   │   │   │   └── GpsApp.vue
│       │   │   │   ├── mainmenu
│       │   │   │   │   ├── TabletMainMenu.vue
│       │   │   │   │   └── tabletmainmenu.scss
│       │   │   │   ├── mech
│       │   │   │   │   └── MechApp.vue
│       │   │   │   ├── messages
│       │   │   │   │   └── MessagesApp.vue
│       │   │   │   ├── news
│       │   │   │   │   └── NewsApp.vue
│       │   │   │   ├── property
│       │   │   │   │   └── PropertyApp.vue
│       │   │   │   ├── radio
│       │   │   │   │   └── RadioApp.vue
│       │   │   │   ├── settings
│       │   │   │   │   └── SettingsApp.vue
│       │   │   │   ├── taxi
│       │   │   │   │   └── TaxiApp.vue
│       │   │   │   ├── tinder
│       │   │   │   │   └── TinderApp.vue
│       │   │   │   ├── trucker
│       │   │   │   │   └── TruckerApp.vue
│       │   │   │   └── weather
│       │   │   │       └── WeatherApp.vue
│       │   │   └── tablet.scss
│       │   └── watch
│       │       ├── Watch.vue
│       │       ├── assets
│       │       │   └── bezel
│       │       │       ├── AW Ultra 3 - Black + Alpine Loop Black.png
│       │       │       ├── AW Ultra 3 - Black + Alpine Loop Light Blue.png
│       │       │       ├── AW Ultra 3 - Black + Milanese Loop.png
│       │       │       ├── AW Ultra 3 - Black + Ocean Band Anchor Blue.png
│       │       │       ├── AW Ultra 3 - Black + Ocean Band Black.png
│       │       │       ├── AW Ultra 3 - Black + Trail Loop Black Charcoal.png
│       │       │       ├── AW Ultra 3 - Natural + Alpine Loop Light Blue.png
│       │       │       ├── AW Ultra 3 - Natural + Alpine Loop Terra Cotta.png
│       │       │       ├── AW Ultra 3 - Natural + Milanese Loop.png
│       │       │       ├── AW Ultra 3 - Natural + Ocean Band Anchor Blue.png
│       │       │       ├── AW Ultra 3 - Natural + Ocean Band Neon Green.png
│       │       │       ├── AW Ultra 3 - Natural + Trail Loop Blue Bright Blue.png
│       │       │       └── AW Ultra 3 - Natural + Trail Loop Green Neon.png
│       │       └── watch.scss
│       ├── assets
│       │   ├── fonts
│       │   │   ├── icons
│       │   │   │   ├── fonts.css
│       │   │   │   ├── icomoon.svg
│       │   │   │   ├── icomoon.ttf
│       │   │   │   └── icomoon.woff
│       │   │   └── main.ts
│       │   ├── images
│       │   │   ├── arrow.svg
│       │   │   └── logo.png
│       │   ├── js
│       │   │   └── functions.ts
│       │   └── styles
│       │       ├── animate.scss
│       │       ├── main.scss
│       │       ├── main.ts
│       │       ├── puregrid.scss
│       │       ├── statistics.scss
│       │       ├── store.scss
│       │       └── style.scss
│       └── dev
│           └── UiShowcase.vue
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.vitest.json
├── vite.config.ts
└── vitest.config.ts
2  [error opening dir]

181 directories, 654 files
