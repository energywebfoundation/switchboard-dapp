pragma solidity ^0.6;
pragma experimental ABIEncoderV2;

contract IdentityRegistry {

  event IdentityCreated(address _sender, address _recordId);
  event IdentityUpdated(address _sender, address _recordId);

  struct Identity {
    string organizationType;
    string name;
    string emailAddress;
    string postalAddress;
  }
  
  struct Record {
    Identity identity;
    uint idListPointer;
  }

  mapping(address => Record) public Table;
  address[] public IdList;

  constructor() public {}

  function identityExists(address identity) public view returns(bool exists) {
    if (IdList.length == 0) return false;
    return (IdList[Table[identity].idListPointer] == identity);
  }

  function getIdentityById(address identity) public view returns(uint index, Identity memory record) {
    require(identityExists(identity));
    return (Table[identity].idListPointer, Table[identity].identity);
  }

  function createIdentity(Identity memory recordData) public returns(bool success) {
    address recordAddress = msg.sender;
    require(!identityExists(recordAddress));
    Table[recordAddress].identity = recordData;
    IdList.push(recordAddress);
    emit IdentityCreated(msg.sender, recordAddress);
    return true;
  }
  
  function getIdentities()public view returns(address[] memory){
    return IdList;
  }

  function updateIdentity(address identity, Identity memory recordData) public returns(bool success) {
    require(identityExists(identity) && msg.sender == identity);
    Table[identity].identity = recordData;
    emit IdentityUpdated(msg.sender, identity);
    return true;
  }

}