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
