// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * PipelineRegistry (Lesson 1)
 * Think of this as a tiny on-chain metadata record for your AI pipeline.
 *
 * - inputCid  = pointer to data stored off-chain (0G Storage)
 * - outputCid = pointer to compute result stored off-chain
 */
contract PipelineRegistry {
    string public inputCid;
    string public outputCid;

    event InputCidSet(string cid);
    event OutputCidSet(string cid);

    function setInputCid(string calldata cid) external {
        inputCid = cid;
        emit InputCidSet(cid);
    }

    function setOutputCid(string calldata cid) external {
        outputCid = cid;
        emit OutputCidSet(cid);
    }
}
