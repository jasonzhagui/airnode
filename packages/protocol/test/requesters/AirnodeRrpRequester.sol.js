/* globals context */
const hre = require('hardhat');
const { expect } = require('chai');

let roles;
let airnodeRrpRequester;

beforeEach(async () => {
  const accounts = await hre.ethers.getSigners();
  roles = {
    deployer: accounts[0],
    mockAirnodeRrp: accounts[1],
    randomPerson: accounts[9],
  };
  const airnodeRrpRequesterFactory = await hre.ethers.getContractFactory('MockAirnodeRrpRequester', roles.deployer);
  airnodeRrpRequester = await airnodeRrpRequesterFactory.deploy(roles.mockAirnodeRrp.address);
});

describe('onlyAirnodeRrp', function () {
  context('Caller AirnodeRrp', function () {
    it('does not revert', async function () {
      await expect(
        airnodeRrpRequester.connect(roles.mockAirnodeRrp).fulfill(hre.ethers.constants.HashZero, 0, '0x')
      ).to.not.be.revertedWith('Caller not Airnode RRP');
    });
  });
  context('Caller not AirnodeRrp', function () {
    it('reverts', async function () {
      await expect(
        airnodeRrpRequester.connect(roles.randomPerson).fulfill(hre.ethers.constants.HashZero, 0, '0x')
      ).to.be.revertedWith('Caller not Airnode RRP');
    });
  });
});