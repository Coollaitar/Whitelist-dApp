import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Web3Modal from 'web3modal';
import { providers, Contract } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { WHITELIST_CONTRACT_ADDRESS, abi } from 'constants';

export default function Home() {
  // keep track of wallet connected or not
  const [walletConnected, setWalletConnected] = useState(false);
  // joined whitelist keeps the track of whether the current metamask account has joined the whitelist or not
  const [joinedWhitelist, setjoinedWhitelist] = useState(false);
  // loading is set to true when we are waiting for tx to get mined
  const [loading, setLoading] = useState(false);
  // numberofwhitelisted tracks the number of address
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  // create a reference to the web3 modal (used for connecting to Metamask)
  // **IMP**
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    // since we store web3Modal as a reference
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // if user is not connected to goerli network, let them know and thrown an error

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 5) {
      window.alert('Change the network to Goerli');
      throw new Error('Change network to Goerli');
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  // addAddressToWhitelist: Adds the current connected address to the whitelist

  const addAddressToWhitelist = async () => {
    try {
      // we need a Signer here since this is a write transaction
      const signer = await getProviderOrSigner(true);

      // create a new instance of the contract with a signer

      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      // call addAddresstowhitelist from contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);

      // wait for tx to get mined
      await tx.wait();
      setLoading(false);

      // get the updated number of address in the whitelist
      await getNumeberOfWhitelisted();
      setjoinedWhitelist(true);
    } catch (err) {
      console.error(err);
    }
  };

  // getNumberOfWhitelisted: gets the number of whitelisted addresses

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();

      // read-only access to the contract

      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      // call the numAddressesWhitelisted from the contract

      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (err) {
      console.error(err);
    }
  };

  // check if the address is in whitelist

  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      // get the address associated to the signer which is connected to Metamask
      const address = await signer.getAddress();
      // call the whitelistedAddresses from the contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setjoinedWhitelist(_joinedWhitelist);
    } catch (err) {
      console.error(err);
    }
  };

  // Now Connect the Metamask wallet

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (err) {
      console.error(err);
    }
  };

  // Returns a button based on the state of the dApp

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  // useEffect are used to react to changes in state of the website

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'goerli',
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name='description' content='Whitelist-Dapp' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src='./crypto-devs.svg' />
        </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}
