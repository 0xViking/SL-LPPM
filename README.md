# Guide on how to install and run the app locally
   1. Clone this repositry(https://github.com/0xViking/sl-lppm.git)
   2. In the root folder rename the ```.env.default``` file to ```.env``` and add the necessary API keys(Let me know if you need api keys, will send it privately)
   3. Open your terminal in the root folder and run ```npm install```
   4. Once the installations are done, You have two options
   (a). run ```npm run dev```(in Dev mode the useEffect will run twice, so you might see screen/notifications rendering twice)
   (b). run ```npm run build``` and once build is generated run ```npm run start``` (This will generate an optimized production level build, which should work fine)
   5. Once the server starts, you can open browser and open http://localhost:3000 or the address/port showed on the console
       

# SL-LPPM
UI to monitor LP positions on Uniswap

Day 1 :
### Status-1 (09-06-2022) ~ 1.5hrs work:
 * Initialized repo with nextjs
 * Created basic UI with Solidus Labs logo 
 * Connect wallet button implemented using Moralis, web3uikit

![image](https://user-images.githubusercontent.com/72988597/172757987-7ef42359-8477-42ee-96d0-2e0ee4cf35cd.png)

### Status-2 (09-06-2022) ~ 4hrs work:
 * Created sidebar menu consisting to menu items
 * Created Main view which will show the NFTs in the connected wallet and connected chain using NFTBalance component powered by web3uikit
 * Anoher UI to show LP Position(As of now temp view shows a card)
 * Added Layout view - to show Hwader, Sidebar on everyview

1.Main UI showing NFTs the connected wallet is holding:

![image](https://user-images.githubusercontent.com/72988597/172951566-e6fd3511-5256-4c16-8da7-f9a8b458e270.png)

2.Temp UI where i have to show LP Position:

![image](https://user-images.githubusercontent.com/72988597/172951631-bb3f8bf8-cf82-477a-ac78-bea87e43de6f.png)


### Status-3 (11-06-2022) ~ 1.5hrs work:
 * Seperate menu items for both V2 and V3 positions
 * Hardcoded view created for V3 position(Need to update this according to the API response)
 * Temporary view for V2
 
 https://user-images.githubusercontent.com/72988597/173200981-1ca2bc5f-b34c-4181-9a4f-29e02a4c84d1.mp4
 
 
 ### Status-4 (13-06-2022) ~ 3hrs work:
 * Created two api calls for both V2 and V3
 * V3 page now gets data using Moralis API and displays V3 LP Positions dynamically(As of now i hardcoded the wallet address - I don't have any wallet which has LP positions on both V2 and V3)
 * V2 page now gets data from Zapper.fi API and displays V2 LP positions dynamically as a table(As of now i hardcoded the wallet address - I don't have any wallet which has LP positions on both V2 and V3)

1. V2 Positions page showing the current poisiotns in the wallet address given:

 ![image](https://user-images.githubusercontent.com/72988597/173390825-d37e2ca6-5f85-4945-a6d0-dc9391a96f84.png)

2.V3 Positions page showing current Postions NFTs in the wallet address given:

 ![image](https://user-images.githubusercontent.com/72988597/173391153-57846846-0c8b-4acd-8726-fe9cdb610e28.png)
 
 
 
 ### Status-5 (14-06-2022) ~ 5hrs work:
 * Fixed issue with the styled-components in nextjs
 * Notifications will be shown in bottom right of the screen
 * On V2 postions page a table will be shown with positions the address is holding, now at the starting there is a ICON(list) in the name tab, If you click on it a modal will be shown with all the logs of the user for that pool

1. Notifications on the bottom right & List icon to show logs of user for each pool the address holding a position:

 ![image](https://user-images.githubusercontent.com/72988597/173703096-6bf35452-1dc4-4f85-b0ee-e6d8934f83e6.png)


2.After clicking on the list icon for any of the pool it pops a modal with the history of that address in the pool:

![image](https://user-images.githubusercontent.com/72988597/173703257-c042790c-c9d4-4beb-89eb-2eebcce82048.png)


### Status-6 (16-06-2022) ~ 3hrs work:
 * Cleanup and UI changes


### Status-7 (17-06-2022) ~ 4hrs work:
 * Updated Home page to show the V2 and V3 value at one glance using Zapper API
 * Added recent 100 txns history of the pool as well in the V2 page
 * Few other Minor UI changes and other fixes

1. Home page updated.

![image](https://user-images.githubusercontent.com/72988597/174218183-dd9c5427-36bb-4aa0-a4eb-80d037a714f5.png)


2. Added recent 100 txns History in the V2 page
![image](https://user-images.githubusercontent.com/72988597/174218426-ac3ebb71-83b6-42bd-b47b-26f03207ceb0.png)

