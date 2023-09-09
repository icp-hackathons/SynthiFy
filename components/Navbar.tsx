import styles from "../assets/styles/Navbar.module.css";
import Link from "next/link";
import { Principal } from "@dfinity/principal";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const MyApp = () => {
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalOpen0, setIsModalOpen0] = useState(false);
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        const result = await window.ic.infinityWallet.isConnected();
        setIsConnected(result);

        if (result) {
          const publicKey = await window.ic.infinityWallet.getPrincipal();
          const address = publicKey.toText();
          setConnectedAddress(address);
          console.log(`The connected user's public key is:`, publicKey);
        }
      } catch (e) {
        console.log("Error checking wallet connection:", e);
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const publicKey = await window.ic.infinityWallet.requestConnect();
      router.reload();
      const address = publicKey.toText();
      setConnectedAddress(address);
      console.log(`The connected user's public key is:`, publicKey);
    } catch (e) {
      console.log("Error connecting wallet:", e);
    }
  };

  const disconnectWallet = async () => {
    try {
      await window.ic.infinityWallet.disconnect();
      setIsConnected(false);
      setConnectedAddress(null);
      console.log("Wallet disconnected");
    } catch (e) {
      console.log("Error disconnecting wallet:", e);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const copyAddress = () => {
    if (connectedAddress) {
      navigator.clipboard
        .writeText(connectedAddress)
        .then(() => {
          alert("Address copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying address to clipboard:", error);
        });
    }
  };

  return (
    <nav className={styles.navbar}>
      <h2 className={styles.navbarTitle}>Logo</h2>
      <div className={styles.navbarLinks}>
        <Link href="/" className={styles.navbarLink}>
          Dashboard
        </Link>
        <Link href="/mint" className={styles.navbarLink}>
          Mint
        </Link>
        <Link href="/profile" className={styles.navbarLink}>
          Profile
        </Link>
      </div>
      {isConnected ? (
        <div className={styles.dropdownContainer}>
          <button className={styles.connectButton} onClick={toggleModal}>
            {connectedAddress ? `${connectedAddress.slice(0, 8)}... ` : ""}
            {isModalOpen ? (
              <i className="fa fa-caret-down"></i>
            ) : (
              <i className="fa fa-caret-down"></i>
            )}
          </button>
          {isModalOpen && (
            <div className={styles.modalBackdrop}>
              <div className={styles.modalContent}>
                <i
                  className={`fa fa-times-circle ${styles.closeIcon}`}
                  onClick={toggleModal}
                ></i>
                <div className={styles.modalContainer}>
                  <div className={styles.modalHeader}>
                    <h3>{connectedAddress}</h3>
                  </div>
                  <div className={styles.modalActions}>
                    <button className={styles.copyButton} onClick={copyAddress}>
                      <i className="fa fa-copy"></i> Copy Address
                    </button>
                    <button
                      className={styles.disconnectButton}
                      onClick={() => {
                        disconnectWallet();
                        toggleModal();
                      }}
                    >
                      <i className="fa fa-sign-out"></i> Disconnect Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            className={styles.connectButton}
            type="button"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        </div>
      )}
    </nav>
  );
};

export default MyApp;