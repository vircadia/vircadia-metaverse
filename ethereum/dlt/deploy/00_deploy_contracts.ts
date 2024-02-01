import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, getChainId } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();
    console.log("Deployer:", deployer);
    console.log("Chain:", await getChainId());

    await deploy("VircadiaERC20", {
        from: deployer,
        gasLimit: 4000000,
        log: true,
    });
};
export default func;
