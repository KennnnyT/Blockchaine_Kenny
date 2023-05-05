// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "../node_modules/abdk-libraries-solidity/ABDKMathQuad.sol";

contract TirelireCrypto {
    using ABDKMathQuad for uint256;
    

    struct User {
        uint256 amount;
        uint256 depositTime;
        bool hasWithdrawn;
    }

    mapping(address => User) public users;

    uint256 public totalAmount;

    address[] public keys; // Ajout de la déclaration du tableau de clés

    function deposit() public payable {
        require(users[msg.sender].amount == 0, "Vous avez deja depose de l'argent");
        require(msg.value > 0, "Le montant depose doit etre superieur a zero");

        User memory user = User(msg.value, block.timestamp, false);
        users[msg.sender] = user;
        totalAmount += msg.value;
        
        // Ajout de l'adresse de l'utilisateur au tableau des clés
        keys.push(msg.sender);
    }

    function withdraw() public {
        require(users[msg.sender].amount > 0, "Vous n'avez pas depose d'argent");
        require(block.timestamp > users[msg.sender].depositTime + 86400, "Vous ne pouvez pas retirer avant 24 heures");
        require(!users[msg.sender].hasWithdrawn, "Vous avez deja effectue un retrait");

        uint256 amount = users[msg.sender].amount;
        users[msg.sender].amount = 0;
        users[msg.sender].hasWithdrawn = true;
        totalAmount -= amount;

        if (block.timestamp <= users[msg.sender].depositTime + 172800) {
           uint256 penalty = amount / 5;

            amount -= penalty;
            totalAmount -= penalty;
            uint256 remainingAmount = totalAmount;

            for (uint256 i = 0; i < keys.length; i++) {
               remainingAmount -= users[keys[i]].amount;

            }

            for (uint256 i = 0; i < keys.length; i++) {
                address addr = keys[i];
                if (users[addr].amount > 0) {
                    uint256 userShare = amount * users[addr].amount / totalAmount;

                    users[addr].amount += userShare;
                }
            }
        }

        payable(msg.sender).transfer(amount);
    }

    // Suppression de la fonction getUserAddresses()

}
