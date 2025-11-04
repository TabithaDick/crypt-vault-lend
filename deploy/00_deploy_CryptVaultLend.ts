import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployed = await deploy("CryptVaultLend", {
    from: deployer,
    args: [],
    log: true,
  });

  console.log(`CryptVaultLend contract deployed at: ${deployed.address}`);
};

export default func;
func.id = "deploy_crypt_vault_lend";
func.tags = ["CryptVaultLend"];
