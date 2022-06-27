import React, { useEffect, useState, useRef } from "react";
import { useSpring, animated, config, easings } from 'react-spring'
import { ReactComponent as SnoopIllustration } from './snoopIllustration.svg';
import { Collapse } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { read, readdir } from "fs";
import backgroundmb from "./mbLitty.png";
import mbWhite from "./mbWhite.png";
import buttonBG from "./buttonBG.png";
import tokeArea from "./tokeArea.png";
import snoopCooking from "./snoopCooking.png";
import footerImg from "./footerImg.jpg";



const { Panel } = Collapse;

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
    height: "145px",
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
  const headerProps = useSpring({
    config: { duration: 350 },
    to: { opacity: 1 },
    from: { opacity: 0 },
    delay: 1000,
  });
  const heroProps = useSpring({
    config: {
      duration: 1600,
      easing: easings.easeInOutElastic,
    },
    to: { opacity: 1, marginLeft: "0" },
    from: { opacity: 0, marginLeft: "-6510px" },
    delay: 1350,
  });
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
      .mint(mintAmount, signature)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry bud, stuff went wrong! Maybe a rejected transaction or a contract error, try again please!");
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
    <s.Screen style={{ background: backgroundmb, backgroundPosition: "top", overflowX: "clip" }}>
      <animated.div style={headerProps}>
      <s.Container
        flex={1}
        ai={"left"}
        jc={"left"}
        style={{
          width: "100%",
          height: "125px",
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
                fontWeight: "600",
                width: "15vw",
                height: "40px",
                fontSize: "19px",
                border: "none",
                padding: "5px",
                color: "#f2f2f2",
                background: "transparent",
                marginRight: "5px",
                cursor: "pointer",
                textShadow: "0 0 4px black",
              }}
            >
              Marketplace
            </button></a>



            <a href="https://quickswap.exchange/#/swap?inputCurrency=0x955ce23f20217a6aa205620b40ede4c9e83d325f"><button

              style={{
                fontWeight: "600",
                width: "15vw",
                height: "40px",
                border: "none",
                fontSize: "19px",
                padding: "5px",
                color: "#f2f2f2",
                background: "transparent",
                marginRight: "25px",
                cursor: "pointer",
                textShadow: "0 0 4px black",
              }}
            >
              WTF Are Buds?
            </button></a>

            <a href="https://quickswap.exchange/#/swap?inputCurrency=0x955ce23f20217a6aa205620b40ede4c9e83d325f"><button

              style={{
                fontWeight: "600",
                width: "15vw",
                height: "40px",
                border: "none",
                fontSize: "19px",
                padding: "5px",
                color: "#f2f2f2",
                background: "transparent",
                marginRight: "5px",
                cursor: "pointer",
                textShadow: "0 0 4px black",
              }}
            >
              Get Started
            </button></a>
            {blockchain.account === "" ||
              blockchain.smartContract === null ? (
              <div style={{ width: "29vw", display: "flex", justifyContent: "flex-end" }}>
                <StyledButton
                  style={{}}
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(connect());
                    getData();
                  }}
                >
                  CONNECT WALLET
                </StyledButton>
              </div>
            ) : (<div style={{ width: "29vw", display: "flex", justifyContent: "flex-end" }}>
              <h1 style={{ background: "rgb(252, 246, 214)", padding: "10px", border: "4px solid rgb(93, 59, 148)", borderRadius: "9px", }}>{truncate(blockchain.account, 10)}</h1></div>)}

          </div>
        </div>

      </s.Container>
      </animated.div>
      <animated.div style={heroProps}>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: "0px 24px", backgroundColor: "transparent", display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignContent: "center", alignItems: "center", flexWrap: "wrap", }}
        image={CONFIG.SHOW_BACKGROUND ? "https://rdbcarclub.com/wp-content/uploads/2021/11/new1-1.png" : null}
      >

        <a href={CONFIG.MARKETPLACE_LINK}>
          <SnoopIllustration id="snoopIllustration" style={{ height: "80vh", width: "auto", margin: "0px 90px 0px 50px" }} />
        </a>
        <div id="buySection">
          <ResponsiveWrapper flex={2}
            id="texturedCard" style={{ padding: 14, width: "62%", minWidth: "420px" }}>

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
                <div style={{ display: "flex", flexWrap: "nowrap", justifyContent: "space-around", alignItems: "center", alignContent: "center" }}>

                  <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                    <h3 style={{ fontSize: "28px", color: "#5D3B94", fontWeight: "400" }}>Drop Size</h3>
                    <h1 style={{ fontSize: "50px", color: "#5D3B94", }}>{CONFIG.MAX_SUPPLY}</h1>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                    <h3 style={{ fontSize: "28px", color: "#5D3B94", fontWeight: "400" }}>Mint Price</h3>
                    <h1 style={{ fontSize: "50px", color: "#5D3B94",}}>Ξ 0.064</h1>
                  </div>

                </div><p id="randomMintP" style={{ fontSize: "18px", marginTop: "25px" }}>Random mint assignment.</p>
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
                background: "transparent",
                border: "solid 1px black !important"
              }}
            >
              {feedback}
            </s.TextDescription>
            <s.SpacerMedium />
            <s.Container ai={"center"} jc={"center"} fd={"row"}>
              <StyledRoundButton
                style={{ lineHeight: 0.4, fontSize: "36px" }}
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
              id="mintNumber"
                style={{
                  textAlign: "center",
                  color: "#5D3B94",
                  border: "solid 4px #5D3B94",
                  fontSize: "40px",
                  background: "#FCF6D6",
                  padding: "10px 50px 10px 50px",
                  borderRadius: "12px",
                  
                }}
              >
                {mintAmount}
              </s.TextDescription>
              <s.SpacerMedium />
              <StyledRoundButton
                style={{ fontSize: "36px" }}
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
      </animated.div>

      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: "150px 25px 75px 25px", backgroundColor: "transparent", display: "flex", flexDirection: "row", justifyContent: "center", alignContent: "center", alignItems: "center", flexWrap: "wrap", }}
      >
        <img id="tokeArea" style={{ width: "78vw", maxWidth: "1460px" }} src={tokeArea}>
        </img>
      </s.Container>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ResponsiveWrapper flex={1}
          id="texturedCard2" style={{ width: "687px", minWidth: "411px", maxWidth: "690px", minHeight: "705px", margin: "0px 0px 70px 0px", backgroundSize: "contain" }}>

          <s.Container
            flex={2}
            jc={"flex-start"}
            ai={"center"}
            style={{
              width: "100%",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 58,
                lineHeight: ".9",
                fontWeight: "bold",
                fontFamily: "Fira Sans",
                color: "#5D3B94",
                padding: 25,

              }}
            >
              <b style={{ textAlign: "center", marginTop: "15px !important" }}>GET LITTY WITH SNOOP DOGG </b>
              <br />
              <p id="randomMintP" style={{ fontSize: "24px", marginTop: "50px", lineHeight: "1.3", textAlign: "justify", margin: "50px 20px 0px 20px" }}>MonsterBuds and LittyUp are colliding to bring unique cannabis experiences around the United States. Each NFT gives you special access to LittyUp-presented cannabis farmers markets to shop, smoke, network, and experience canna-friendly music, games, and food. Mint a 1/1 from this collection and redeem an all-inclusive trip to see Snoop Dogg live!</p>
            </s.TextTitle>



          </s.Container>

        </ResponsiveWrapper>
        <img style={{ height: "619px", marginBottom: "70px", marginLeft: "-53px" }} src={snoopCooking}></img>
      </div>

      <s.Container
        flex={1}
        ai={"center"}
        id="heroBackground"
        style={{ padding: "125px 55px 135px 55px", backgroundColor: "#9451BA", display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center", flexWrap: "wrap", }}
      >
        <s.TextTitle
          style={{
            display: "block",
            textAlign: "center",
            fontSize: 88,
            fontWeight: "bold",
            fontFamily: "Fira Sans",
            color: "#FEF6D2",
          }}
        >FAQs</s.TextTitle>
        <Collapse style={{ width: "70vw", margin: "45px" }} accordion>
          <Panel header="Who is LittyUp?" key="1">
            <p style={{ fontSize: "20px", color: "white" }}>
              At MonsterBuds, we're always thinking of ways to provide utility within the NFT space. What LittyUp is building is incredible and we just had to hop on with them.

              Our brands are colliding for the first time, while bringing Snoop Dogg along for the ride!</p>
          </Panel>
          <Panel header="Why LittyUp and MonsterBuds?" key="2">
            <p style={{ fontSize: "20px", color: "white" }}>Each of these NFT's will give you access to LittyUp presented cannabis farmers markets across multiple states, to include but not limited to: Oklahoma, Michigan, California, Florida.

              These are not your regular farmers markets. The CannaLit farmers markets are 4/20 friendly, going state to state with markets that include brands from all over the United states.

              Shop, smoke, and be entertained by networking, music, games and foods. </p>
          </Panel>
          <Panel header="What's the utility?" key="3">
            <p style={{ fontSize: "20px", color: "white" }}>Only 420 will ever exist. There are 2 1/1's, 165 concentrate cards, 140 edible cards and 113 flower cards. Minting a 1/1 from the collection will allow you to redeem an all-inclusive trip to see Snoop Dog live.

              Flight, hotel, and tickets to the show are included. (Max value $1500) </p>
          </Panel>
          <Panel style={{ borderRadius: "10px" }} header="Whats Snoop got to do with it?" key="5">
            <p style={{ fontSize: "20px", color: "white" }}>Snoop has partnered with Litty Up and MonsterBuds to build positive interactions between all of our fans, across many aspects: IRL, online, gaming, music.</p>
          </Panel>
        </Collapse>
      </s.Container>

      <img id="tokeArea2" style={{ width: "102.3%", marginBottom: "-5px" }} src={footerImg}>
      </img>

      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: "50px 25px", backgroundColor: "#09514B", display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center", alignItems: "center", flexWrap: "wrap", }}
      >
       <footer class="footer">
        <div class="icons">
          <div style={{display: "flex", justifyContent: "center"}}>
           <a href="#" style={{color: "#000", background: "#f2f2f2", width: "56px", height: "56px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50px"}}><i class="fab fa-discord" ></i></a>
           <a href="#" style={{color: "#000", background: "#f2f2f2", width: "56px", height: "56px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50px"}}><i class="fab fa-instagram"></i></a>
           <a href="#" style={{color: "#000", background: "#f2f2f2", width: "56px", height: "56px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "50px"}}><i class="fab fa-twitter"></i></a>
           </div>
            <p class="company-name">
            © Monsterbuds | All Rights Reserved 2022
            </p>
        </div>
    </footer>
        
      </s.Container>

    </s.Screen>
  );
}

export default App;
