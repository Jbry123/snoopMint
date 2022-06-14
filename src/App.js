import React, { useEffect, useState, useRef } from "react";
import {ReactComponent as SnoopIllustration} from './snoopIllustration.svg';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { read, readdir } from "fs";
import backgroundmb from "./mbLitty.png";
import mbWhite from "./mbWhite.png";
import texturedCard from "./texturedCard.png";
import buttonBG from "./buttonBG.png";
import tokeArea from "./tokeArea.png";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

  const styles = {
    headerText: {
      fontSize: "40px",
      fontFamily: "Roboto !important",
      fontWeight: "700",
      color: "#f2f2f2",
      height: "95px",
      width: "100%",
      padding: "0px 30px"
    },
  
    headerText2: {
      marginTop: "75px",
      fontSize: "40px",
      fontFamily: "Roboto !important",
      fontWeight: "500",
      color: "#f2f2f2",
      height: "95px",
      width: "100%",
      padding: "0px 30px",
      textAlign: "center"
    },
  
    tabs: {
      fontSize: "38px",
      fontFamily: "Roboto !important",
      fontWeight: "500",
      color: "#f2f2f2",
      height: "auto",
      width: "100%",
      padding: "0px 30px"
    },
  
    pText: {
  
      fontFamily: "Roboto !important",
      fontSize: "15.5px",
      color: "#b1b1b1",
      height: "160px",
      width: "100%",
      padding: "0px 30px",
      overflow: "overlay"
    },
  
    content: {
      display: "flex",
      justifyContent: "center",
      fontFamily: "Roboto, sans-serif",
      color: "#041836",
      padding: "10px",
    },
    header: {
      position: "relative",
      zIndex: 1,
      height: "175px",
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontFamily: "Roboto, sans-serif",
      padding: "0 50px",
      background: "transparent",
    },
    headerRight: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
      fontSize: "15px",
      fontWeight: "600",
    },
  
  
  
  };

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #EB5A48;
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 160px;
  cursor: pointer;
  box-shadow: inset 0px 0px 0 2px #fe984c, 0px 0px 0 2px #5d3b94;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-image: url(${buttonBG});
  background-color: transparent;
  background-size: contain;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 76px;
  height: 73px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  background-color: var(--accent);
  width: 400px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: #F3164A;
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "0x20bcde673cc3e77d843d100ea14e3760f64e1e11",
    SCAN_LINK: "https://etherscan.io/address/0x20bcde673cc3e77d843d100ea14e3760f64e1e11",
    NETWORK: {
      NAME: "Ethereum",
      SYMBOL: "ETH",
      ID: 1,
    },
    NFT_NAME: "MonsterBuds X Litty Up",
    SYMBOL: "MBLU",
    MAX_SUPPLY: 420,
    WEI_COST: 150000000000000000,
    DISPLAY_COST: 0.15,
    GAS_LIMIT: 120000,
    MARKETPLACE: "opensea",
    MARKETPLACE_LINK: "https://opensea.io/collection/rdb-official",
    SHOW_BACKGROUND: false,
  });


  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);

    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    
 
    let signature = "S2Atx0qfYi32bleF";
    // signature = S2Atx0qfYi32bleF
    blockchain.smartContract.methods
    //change params in mint to number of mints first, then the signature
    .mint( mintAmount, signature)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen style={{background: backgroundmb, backgroundPosition: "top", overflowX: "clip"}}>
      <s.Container
        flex={1}
        ai={"left"}
        jc={"left"}
        style={{
          width: "100%",
          height: "145px",
          background: "transparent",
          justifyContent: "left",
          display: "flex"
        }}
      >
        <div id="header" style={styles.header}>
          <a href="https://app.dreamstarter.co"><img style={{ margin: "15px 25px", width: "135px", height: "auto" }} src={mbWhite}>
          </img></a>

          <div id="headerRight" style={styles.headerRight}>


            <a href="https://dreamr.gitbook.io/welcome-to-dreamr/technology/dreamstarter-nft-launchpad"><button

              style={{
                width: "240px",
                height: "40px",
                fontSize: "17px",
                border: "none",
                padding: "5px",
                color: "#f2f2f2",
                background: "transparent",
                marginRight: "25px",
                cursor: "pointer",
              }}
            >
              Market Place
            </button></a>



            <a href="https://quickswap.exchange/#/swap?inputCurrency=0x955ce23f20217a6aa205620b40ede4c9e83d325f"><button

              style={{
                width: "150px",
                height: "40px",
                border: "none",
                fontSize: "17px",
                padding: "5px",
                color: "#f2f2f2",
                background: "transparent",
                marginRight: "25px",
                cursor: "pointer",
              }}
            >
              WTF ARE BUDS?
            </button></a>

            <a href="https://quickswap.exchange/#/swap?inputCurrency=0x955ce23f20217a6aa205620b40ede4c9e83d325f"><button

              style={{
                width: "150px",
                height: "40px",
                border: "none",
                fontSize: "17px",
                padding: "5px",
                color: "#f2f2f2",
                background: "transparent",
                marginRight: "25px",
                cursor: "pointer",
              }}
            >
              Get Started
            </button></a>

            <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      CONNECT WALLET
                    </StyledButton>
          </div>
        </div>

      </s.Container>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: "0px 24px", backgroundColor: "transparent", display: "flex", flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center", flexWrap: "wrap", }}
        image={CONFIG.SHOW_BACKGROUND ? "https://rdbcarclub.com/wp-content/uploads/2021/11/new1-1.png" : null}
      >

        <a href={CONFIG.MARKETPLACE_LINK}>
          <SnoopIllustration id="snoopIllustration" style={{height: "77vh", width: "auto", margin: "0px 110px"}} />
        </a>
        <div id="buySection">
        <ResponsiveWrapper flex={2}
            id="texturedCard" style={{ padding: 24, width: "62%", minWidth: "420px" }}>
       
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              width: "100%",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 28,
                fontWeight: "bold",
                fontFamily: "Fira Sans",
                color: "#5D3B94",
              }}
            >
              <b>MONSTERBUDS X LITTY UP </b>
              <br />
              <div style={{display: "flex", flexWrap: "nowrap", justifyContent: "space-around", alignItems: "center", alignContent: "center" }}>

                <div style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                <h3 style={{fontSize: "28px",}}>Drop Size</h3>
                <h1 style={{fontSize: "50px",}}>{CONFIG.MAX_SUPPLY}</h1>
                </div>

                <div style={{display: "flex", justifyContent: "center", flexDirection: "column"}}>
                <h3 style={{fontSize: "28px",}}>Mint Price</h3>
                <h1 style={{fontSize: "50px",}}>Ξ 0.064</h1>
                </div>
                
              </div><p id="randomMintP" style={{fontSize: "18px", marginTop: "25px"}}>Random mint assignment.</p>
            </s.TextTitle>
            
      
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                
              </>
            )}
            
          </s.Container>
          
        </ResponsiveWrapper>
        
        <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton id="buyButton"
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "MINTING" : "BUY"}
                      </StyledButton>
                    </s.Container>
                  </>
                  </div>
        {/* <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "#F3164A",
            }}
          >
            Please make sure you are connected to the right network (
            {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "#F3164A",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
            successfully mint your NFT. We recommend that you don't lower the
            gas limit.
          </s.TextDescription>
        </s.Container> */}
      </s.Container>

      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: "50px 25px", backgroundColor: "transparent", display: "flex", flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center", flexWrap: "wrap", }}
        image={CONFIG.SHOW_BACKGROUND ? "https://rdbcarclub.com/wp-content/uploads/2021/11/new1-1.png" : null}
      >
        <img id="tokeArea" src={tokeArea}>
        </img>

      </s.Container>

    </s.Screen>
  );
}

export default App;
