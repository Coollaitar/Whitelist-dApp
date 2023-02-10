# Whitelist dApp

Simple dApp which used to add your address into Whitelist

<img src="https://github.com/Coollaitar/Whitelist-dApp/blob/main/wl1.jpg" width="1000" height="550" />

## Steps For making Project :

1. Write a **Smart Contract** like Whitelist.sol
2. Then write **Deploy** script like deploy.js
3. Then create a dot env file **.env** and enter `QUICKNODE_HTTP_URL` and `PRIVATE_KEY` into the file.
4. Then Deploy your contract and store the **Contract Address** on your notepad and remember your **ABI** code is stored in **Artifacts->Contracts->Whitelist.json** file

---

**Now its time for frontend and connecting Contract with frontend and adding Metamask wallet**

5. Add **CSS** to Home.module.css file
6. In the **Index JS** file inside pages folder

   - Import all libraries, files and react components we need for the frontend
   - Create **useState** for each every step we need
   - write code for getProviderOrSigner()

   ```js
   const getProviderOrSigner = async (needSigner = false) => {
     // since we store web3Modal as a reference
     const provider = await web3ModalRef.current.connect();
     const web3Provider = new providers.Web3Provider(provider);
   };
   ```

   - Check if it is connected to right **Network**
   - Then write code for each function used in Smart Contract

7. Make a folder constants and store **ABI** and **Contract Address** in the index.js file inside constants folder
