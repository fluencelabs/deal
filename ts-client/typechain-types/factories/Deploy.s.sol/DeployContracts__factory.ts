/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  DeployContracts,
  DeployContractsInterface,
} from "../../Deploy.s.sol/DeployContracts";

const _abi = [
  {
    inputs: [],
    name: "IS_SCRIPT",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "run",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "setUp",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60808060405234610027576201000162ff00ff19600d541617600d556131ef908161002d8239f35b600080fdfe6080604052600436101561001257600080fd5b6000803560e01c9081630a9254e41461004a57508063c0406226146100455763f8ccbf471461004057600080fd5b610500565b610294565b3461028157807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610281578046807a184f03e93ff9f4daa797ed6e38ed64bf6a1f01000000000000000080821015610273575b506d04ee2d6d415b85acef810000000080831015610264575b50662386f26fc1000080831015610255575b506305f5e10080831015610246575b5061271080831015610237575b506064821015610227575b600a8092101561021d575b60019081602161010e828701610bb5565b95860101905b6101bc575b5050505061012690610677565b6040517fd930a0e60000000000000000000000000000000000000000000000000000000081528281600481737109709ecfa91a80626ff3989d68f67f5b1dd12d5afa9182156101b7576101929261018d928591610195575b506101876107b8565b906107f1565b61094a565b80f35b6101b191503d8087833e6101a981836105fc565b810190610773565b8561017e565b610799565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff849101917f30313233343536373839616263646566000000000000000000000000000000008282061a83530491821561021857919082610114565b610119565b91600101916100fd565b91906064600291049101916100f2565b600491939204910191846100e7565b600891939204910191846100da565b601091939204910191846100cb565b602091939204910191846100b9565b6040935081049150846100a0565b80fd5b600091031261028f57565b600080fd5b3461028f576000807ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc360112610281576102cc611223565b906102d5611cfe565b6102dd6116d3565b92617a698151146000146104cb576102f3610c04565b936040908151917fd145736c0000000000000000000000000000000000000000000000000000000083528261032c600498898301610ca6565b03968684737109709ecfa91a80626ff3989d68f67f5b1dd12d9981838c5af19384156101b75787946104af575b50865b600a63ffffffff82161061039357505050505061038b9293505b60208101516060604083015192015192611982565b610192611e89565b8251907f6229498b000000000000000000000000000000000000000000000000000000008252602080838c81806103cd878d8b8401610d43565b03915afa9283156101b7576104208c8c9584938791610482575b5088519687809481937f221000640000000000000000000000000000000000000000000000000000000083528b83019190602083019252565b03925af180156101b7576104509361044b928c92610455575b5050610445818b610ebb565b86610ebb565b610d1a565b61035c565b6104749250803d1061047b575b61046c81836105fc565b810190610d67565b3880610439565b503d610462565b6104a29150843d86116104a8575b61049a81836105fc565b810190610d34565b386103e7565b503d610490565b6104c49194503d8089833e6101a981836105fc565b9238610359565b836104da61038b94958461181c565b6104e6575b5050610376565b6104f9916104f48286610d93565b610d93565b38806104df565b3461028f5760007ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc36011261028f57602060ff600d5460101c166040519015158152f35b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b67ffffffffffffffff811161058757604052565b610544565b6060810190811067ffffffffffffffff82111761058757604052565b6080810190811067ffffffffffffffff82111761058757604052565b6020810190811067ffffffffffffffff82111761058757604052565b6040810190811067ffffffffffffffff82111761058757604052565b90601f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0910116810190811067ffffffffffffffff82111761058757604052565b60005b8381106106505750506000910152565b8181015183820152602001610640565b906106736020928281519485920161063d565b0190565b906106cb60256040518461069582965180926020808601910161063d565b81017f2e6a736f6e00000000000000000000000000000000000000000000000000000060208201520360058101855201836105fc565b565b604051906106cb826105a8565b604051906106cb8261058c565b67ffffffffffffffff811161058757601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b9092919261072e816106e7565b9161073c60405193846105fc565b82948284528282011161028f5760206106cb93019061063d565b9080601f8301121561028f57815161077092602001610721565b90565b9060208282031261028f57815167ffffffffffffffff811161028f576107709201610756565b6040513d6000823e3d90fd5b604051906107b2826105c4565b60008252565b604051906107c5826105e0565b600d82527f2f6465706c6f796d656e74732f000000000000000000000000000000000000006020830152565b6106cb9193929360405194859183516108128160209687808801910161063d565b83016108268251809387808501910161063d565b016108398251809386808501910161063d565b010380855201836105fc565b90600182811c9216801561088e575b602083101461085f57565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b91607f1691610854565b8181106108a3575050565b60008155600101610898565b90601f82116108bc575050565b6106cb91600e6000527fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c3fd906020601f840160051c83019310610906575b601f0160051c0190610898565b90915081906108f9565b9190601f811161091f57505050565b6106cb926000526020600020906020601f840160051c8301931061090657601f0160051c0190610898565b90815167ffffffffffffffff8111610587576109708161096b600e54610845565b6108af565b602080601f83116001146109c957508192936000926109be575b50507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c191617600e55565b01519050388061098a565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0831694610a1a600e6000527fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c3fd90565b926000905b878210610a75575050836001959610610a3e575b505050811b01600e55565b01517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88460031b161c19169055388080610a33565b80600185968294968601518155019501930190610a1f565b919091825167ffffffffffffffff811161058757610ab581610aaf8454610845565b84610910565b602080601f8311600114610b0e575081929394600092610b03575b50507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8260011b9260031b1c1916179055565b015190503880610ad0565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0831695610b4285600052602060002090565b926000905b888210610b9d57505083600195969710610b66575b505050811b019055565b01517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60f88460031b161c19169055388080610b5c565b80600185968294968601518155019501930190610b47565b90610bbf826106e7565b610bcc60405191826105fc565b8281527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0610bfa82946106e7565b0190602036910137565b60405190610c118261058c565b603b82527f73742074657374207465737420746573742074657374206a756e6b00000000006040837f746573742074657374207465737420746573742074657374207465737420746560208201520152565b907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f602093610c9f8151809281875287808801910161063d565b0116010190565b9060806107709260408152600e60408201527f414e56494c5f4d4e454d4f4e494300000000000000000000000000000000000060608201528160208201520190610c63565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b63ffffffff809116908114610d2f5760010190565b610ceb565b9081602091031261028f575190565b9063ffffffff610d60602092959495604085526040850190610c63565b9416910152565b9081602091031261028f575173ffffffffffffffffffffffffffffffffffffffff8116810361028f5790565b90610e866106cb9260405190600080602095868501937fa9059cbb00000000000000000000000000000000000000000000000000000000855273ffffffffffffffffffffffffffffffffffffffff80921660248701527fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff604487015260448652610e1c866105a8565b169260405194610e2b866105e0565b8786527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c656488870152519082855af13d15610eb3573d91610e6a836106e7565b92610e7860405194856105fc565b83523d60008785013e610fd1565b8051918215928315610e9b575b505050610f46565b610eab9350820181019101610f2e565b388080610e93565b606091610fd1565b90610e866106cb9260405190600080602095868501937fa9059cbb00000000000000000000000000000000000000000000000000000000855273ffffffffffffffffffffffffffffffffffffffff809216602487015269d3c21bcecceda1000000604487015260448652610e1c866105a8565b9081602091031261028f5751801515810361028f5790565b15610f4d57565b60846040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152fd5b9192901561104c5750815115610fe5575090565b3b15610fee5790565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152fd5b82519091501561105f5750805190602001fd5b611095906040519182917f08c379a000000000000000000000000000000000000000000000000000000000835260048301611099565b0390fd5b906020610770928181520190610c63565b604051906080820182811067ffffffffffffffff8211176105875760405260006060838281528260208201528260408201520152565b604051906110ed8261058c565b602782527f2d2d2d2d2d2d2d000000000000000000000000000000000000000000000000006040837f2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d20454e56202d2d2d2d2d2d2d2d2d2d60208201520152565b6040519061114c826105e0565b600982527f434841494e5f49443a00000000000000000000000000000000000000000000006020830152565b60405190611185826105e0565b600f82527f45504f43485f4455524154494f4e3a00000000000000000000000000000000006020830152565b604051906111be826105e0565b601682527f4d494e5f4445504f53495445445f45504f434845533a000000000000000000006020830152565b604051906111f7826105e0565b601782527f4d494e5f52454d41544348494e475f45504f434845533a0000000000000000006020830152565b61122b6110aa565b506040517f5e97348f00000000000000000000000000000000000000000000000000000000908181526020918161129e600482019060408252600e60408301527f45504f43485f4455524154494f4e0000000000000000000000000000000000006060830152600f602060808401930152565b03916000928482737109709ecfa91a80626ff3989d68f67f5b1dd12d928187855af19182156101b757849261143f575b5060405183815285818061131e600482019060408252601560408301527f4d494e5f4445504f53495445445f45504f43484553000000000000000000000060608301526002602060808401930152565b038188865af19384156101b75786918695611420575b50604080519182526004820152601660448201527f4d494e5f52454d41544348494e475f45504f4348455300000000000000000000606482015260026024820152918290608490829088905af19384156101b75793611401575b5061139f61139a6110e0565b611520565b6113b8466113b36113ae61113f565b61145e565b6115ae565b6113c7816113b36113ae611178565b6113d6826113b36113ae6111b1565b6113e5836113b36113ae6111ea565b6113ed6106cd565b934685528401526040830152606082015290565b611419919350843d86116104a85761049a81836105fc565b913861138e565b611438919550823d84116104a85761049a81836105fc565b9338611334565b611457919250853d87116104a85761049a81836105fc565b90386112ce565b6107709060405161146e816105e0565b600581527f1b5b39346d00000000000000000000000000000000000000000000000000000060208201525b604051610770916114a9826105e0565b60048252602091828101907f1b5b306d00000000000000000000000000000000000000000000000000000000825261151460405196846114f2899651809289808a01910161063d565b85016115068251809389808501910161063d565b01915180938684019061063d565b010380845201826105fc565b6115676115936106cb926040519283917f41304fac000000000000000000000000000000000000000000000000000000006020840152602060248401526044830190610c63565b037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081018352826105fc565b600080916020815191016a636f6e736f6c652e6c6f675afa50565b6115936115f6916106cb936040519384927f9710a9d0000000000000000000000000000000000000000000000000000000006020850152604060248501526064840190610c63565b906044830152037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081018352826105fc565b60405190611635826105e0565b600482527f74464c54000000000000000000000000000000000000000000000000000000006020830152565b6040519061166e826105e0565b600982527f54657374455243323000000000000000000000000000000000000000000000006020830152565b604051906116a7826105e0565b600482527f74555344000000000000000000000000000000000000000000000000000000006020830152565b60405160406020820152600d60608201527f466c75656e636520546f6b656e00000000000000000000000000000000000000608082015260806040820152600460a08201527f74464c540000000000000000000000000000000000000000000000000000000060c082015260c0815260e081019080821067ffffffffffffffff8311176105875761177791604052611769611628565b611771611661565b90612da6565b509073ffffffffffffffffffffffffffffffffffffffff8092169161181760405161180f816115676020820160c09060408152600960408201527f55534420546f6b656e0000000000000000000000000000000000000000000000606082015260806020820152600460808201527f745553440000000000000000000000000000000000000000000000000000000060a08201520190565b61176961169a565b501690565b906118c7916040519173ffffffffffffffffffffffffffffffffffffffff8092166020840152166040820152604081526118558161058c565b604051611861816105e0565b600681527f4661756365740000000000000000000000000000000000000000000000000000602082015260405190611898826105e0565b600d82527f4f776e61626c65466175636574000000000000000000000000000000000000006020830152612da6565b9091565b6040516118d7816105c4565b60008152906000368137565b604051906118f0826105e0565b600482527f436f7265000000000000000000000000000000000000000000000000000000006020830152565b60409073ffffffffffffffffffffffffffffffffffffffff61077094931681528160208201520190610c63565b60405190611956826105e0565b600c82527f4552433139363750726f787900000000000000000000000000000000000000006020830152565b92611b2493611ac4611b1493946119d861199a6118cb565b6040516119a6816105e0565b600881527f436f7265496d706c00000000000000000000000000000000000000000000000060208201526117716118e3565b5093611a576119e56118cb565b6040516119f1816105e0565b600881527f4465616c496d706c000000000000000000000000000000000000000000000000602082015260405190611a28826105e0565b600482527f4465616c000000000000000000000000000000000000000000000000000000006020830152612da6565b506040517f6c28e34900000000000000000000000000000000000000000000000000000000602082015273ffffffffffffffffffffffffffffffffffffffff958616602482015260448101989098526064880192909252608487015290911660a4850152839060c4820190565b0390611af67fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0928381018652856105fc565b611b086040519485926020840161191c565b039081018352826105fc565b611b1c6118e3565b611771611949565b5050565b60405190600082600e5491611b3c83610845565b80835292600190818116908115611bc25750600114611b63575b506106cb925003836105fc565b600e600090815291507fbb7b4a454dc3493923482f07822329ed19e8244eff582cc204f8554c3620c3fd5b848310611ba757506106cb935050810160200138611b56565b81935090816020925483858a01015201910190918592611b8e565b602093506106cb9592507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0091501682840152151560051b82010138611b56565b9060405191826000825492611c1684610845565b908184526001948581169081600014611c835750600114611c40575b50506106cb925003836105fc565b9093915060005260209081600020936000915b818310611c6b5750506106cb93508201013880611c32565b85548884018501529485019487945091830191611c53565b90506106cb9550602093507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0091501682840152151560051b8201013880611c32565b60405190611cd2826105e0565b601382527f0a5374617274206465706c6f79696e672e2e2e000000000000000000000000006020830152565b6040517f4777f3cf00000000000000000000000000000000000000000000000000000000815280611d6b600482019060408252600460408301527f544553540000000000000000000000000000000000000000000000000000000060608301526000602060808401930152565b03600091602081737109709ecfa91a80626ff3989d68f67f5b1dd12d938186865af19081156101b7578391611e22575b5015611e0d575b803b15611e095781906004604051809481937f7fb5297f0000000000000000000000000000000000000000000000000000000083525af180156101b757611df0575b506106cb61139a611cc5565b80611dfd611e0392610573565b80610284565b38611de4565b5080fd5b611e1d611e18611b28565b61242b565b611da2565b611e43915060203d8111611e49575b611e3b81836105fc565b810190610f2e565b38611d9b565b503d611e31565b60405190611e5d826105e0565b601082527f0a4465706c6f792066696e6973686564000000000000000000000000000000006020830152565b6040517f4777f3cf00000000000000000000000000000000000000000000000000000000815280611ef6600482019060408252600460408301527f544553540000000000000000000000000000000000000000000000000000000060608301526000602060808401930152565b03600091602081737109709ecfa91a80626ff3989d68f67f5b1dd12d938186865af19081156101b7578391611fab575b5015611f8e575b803b15611e095781906004604051809481937f76eadd360000000000000000000000000000000000000000000000000000000083525af180156101b757611f7b575b506106cb61139a611e50565b80611dfd611f8892610573565b38611f6f565b611f9661305e565b611fa6611fa1611b28565b6128b4565b611f2d565b611fc3915060203d8111611e4957611e3b81836105fc565b38611f26565b90602090818382031261028f57825167ffffffffffffffff9384821161028f570181601f8201121561028f57805193808511610587578460051b9060405195612014868401886105fc565b865284808701928401019380851161028f57858401925b85841061203c575050505050505090565b835183811161028f578791612056848480948a0101610756565b81520193019261202b565b612075602092604083526040830190610c63565b9082818303910152600081520190565b8051906801000000000000000082116105875760075482600755808310612102575b5060076000526020908101907fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c6886000925b8484106120e6575050505050565b600183826120f683945186610a8d565b019201930192906120d8565b600060078152837fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c68892830192015b82811061213e5750506120a7565b8061214b60019254610845565b80612158575b5001612130565b601f9081811184146121705750508281555b38612151565b836121929261218485600052602060002090565b920160051c82019101610898565b6000818152602081208183555561216a565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8114610d2f5760010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b80518210156122145760209160051b010190565b6121d1565b604051906122268261058c565b60006040838281528260208201520152565b906106cb602660405180947f2e00000000000000000000000000000000000000000000000000000000000000602083015261227d81518092602060218601910161063d565b81017f2e6164647200000000000000000000000000000000000000000000000000000060218201520360068101855201836105fc565b60208183031261028f5780519067ffffffffffffffff821161028f57019080601f8301121561028f57815161077092602001610721565b909161230161077093604084526040840190610c63565b916020818403910152610c63565b906106cb602a60405180947f2e00000000000000000000000000000000000000000000000000000000000000602083015261235481518092602060218601910161063d565b81017f2e636f6465486173680000000000000000000000000000000000000000000000602182015203600a8101855201836105fc565b906106cb603260405180947f2e0000000000000000000000000000000000000000000000000000000000000060208301526123cf81518092602060218601910161063d565b81017f2e6372656174696f6e436f64654861736800000000000000000000000000000060218201520360128101855201836105fc565b602061241e91816040519382858094519384920161063d565b8101600881520301902090565b90604051917f261a323e000000000000000000000000000000000000000000000000000000008352602090836124648260048301611099565b03906000948381737109709ecfa91a80626ff3989d68f67f5b1dd12d948189875af19081156101b75786916127ae575b50156127a75790846124d392604051809481927f60f9bb1100000000000000000000000000000000000000000000000000000000835260048301611099565b0381845afa9182156101b757859261278b575b506040517f213e419800000000000000000000000000000000000000000000000000000000815285818061251d8660048301612061565b0381855afa9081156101b7578691612769575b5061253a81612085565b855b81518110156127605761254f8183612200565b5190612559612219565b61256283612238565b90604051918a838061259c7f85940ef100000000000000000000000000000000000000000000000000000000948583528c600484016122ea565b03818a5afa9283156101b7576125e76125ce61261f95612601938f8092612745575b50508c8082518301019101610d67565b73ffffffffffffffffffffffffffffffffffffffff1690565b73ffffffffffffffffffffffffffffffffffffffff168352565b8a61260b8661230f565b604051809581928583528c600484016122ea565b03818a5afa9081156101b75761264a8c9261266c95849161272b575b508b8082518301019101610d34565b8a8401526126578661238a565b90604051948592839283528b600484016122ea565b0381895afa80156101b7576127039461269e6126a8926126fe958e8092612708575b50508b8082518301019101610d34565b6040840152612405565b90604060029173ffffffffffffffffffffffffffffffffffffffff8151167fffffffffffffffffffffffff0000000000000000000000000000000000000000855416178455602081015160018501550151910155565b6121a4565b61253c565b61272492503d8091833e61271c81836105fc565b8101906122b3565b388e61268e565b61273f91503d8086833e61271c81836105fc565b3861263b565b61275992503d8091833e61271c81836105fc565b388f6125be565b50505050509050565b61278591503d8088833e61277d81836105fc565b810190611fc9565b38612530565b6127a09192503d8087833e6101a981836105fc565b90386124e6565b5050509050565b6127c59150843d8611611e4957611e3b81836105fc565b38612494565b906040516127d88161058c565b60406002829473ffffffffffffffffffffffffffffffffffffffff8154168452600181015460208501520154910152565b60405190612816826105e0565b600482527f61646472000000000000000000000000000000000000000000000000000000006020830152565b6040519061284f826105e0565b600882527f636f6465486173680000000000000000000000000000000000000000000000006020830152565b60405190612888826105e0565b601082527f6372656174696f6e436f646548617368000000000000000000000000000000006020830152565b9060408051926128c3846105c4565b60008085526128d06107a5565b9381945b60079081548710156129935750825261298d612987612914877fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c68801611c02565b6129808761292961292484612405565b6127cb565b61295861294a825173ffffffffffffffffffffffffffffffffffffffff1690565b612952612809565b86612a06565b5061296f6020820151612969612842565b86612a80565b50015161297a61287b565b83612a80565b9089612b29565b956121a4565b946128d4565b95505094505090506129ba6129a66107a5565b836020815191012090602081519101201490565b611b24576106cb91612bb3565b91610d6073ffffffffffffffffffffffffffffffffffffffff916129f8604094979697606087526060870190610c63565b908582036020870152610c63565b90600091612a4160405194859384937f972c6062000000000000000000000000000000000000000000000000000000008552600485016129c7565b038183737109709ecfa91a80626ff3989d68f67f5b1dd12d5af19081156101b757600091612a6d575090565b610770913d8091833e6101a981836105fc565b612ac79060009293612af760405195869485947f2d812b44000000000000000000000000000000000000000000000000000000008652606060048701526064860190610c63565b907ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc858303016024860152610c63565b906044830152038183737109709ecfa91a80626ff3989d68f67f5b1dd12d5af19081156101b757600091612a6d575090565b612b7390612a41600093612ba49560405196879586957f88da6d35000000000000000000000000000000000000000000000000000000008752606060048801526064870190610c63565b7ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc9384878303016024880152610c63565b91848303016044850152610c63565b737109709ecfa91a80626ff3989d68f67f5b1dd12d91823b1561028f57612c0d92600092836040518096819582947fe23cd19f000000000000000000000000000000000000000000000000000000008452600484016122ea565b03925af180156101b757612c1e5750565b6106cb90610573565b906106cb602460405184612c4582965180926020808601910161063d565b81017f2e736f6c0000000000000000000000000000000000000000000000000000000060208201520360048101855201836105fc565b60405190612c88826105e0565b601082527f52657573696e67202573206174202573000000000000000000000000000000006020830152565b15612cbb57565b60646040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601960248201527f4661696c656420746f206465706c6f7920636f6e7472616374000000000000006044820152fd5b60405190612d26826105e0565b600f82527f4465706c6f7920257320617420257300000000000000000000000000000000006020830152565b6007549068010000000000000000821015610587576001820180600755821015612214576106cb9160076000527fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c68801610a8d565b92909192612dbf612db961292483612405565b93612c27565b92604051937f8d1cc92500000000000000000000000000000000000000000000000000000000855260009085612df88260048301611099565b038287737109709ecfa91a80626ff3989d68f67f5b1dd12d9281845afa9687156101b7578397612ff0575b50612eae918391612e7a612e4e98999a604051998a91612e48602084019e8f90610660565b90610660565b037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe081018a52896105fc565b60405180809581947f3ebf73b400000000000000000000000000000000000000000000000000000000835260048301611099565b03915afa9081156101b7578291612fd6575b5060208151910120908451872090612eec845173ffffffffffffffffffffffffffffffffffffffff1690565b9773ffffffffffffffffffffffffffffffffffffffff96878a1615998a968588159182612fc8575b82612fba575b505080612fb0575b612f9b575051612f85949392612f3e9290f09687161515612cb4565b612f508686612f4b612d19565b61301e565b612f586106da565b73ffffffffffffffffffffffffffffffffffffffff8716815291602083015260408201526126a884612405565b612f8e57509190565b612f9790612d52565b9190565b975050505050505081612f9791612f4b612c7b565b50803f1515612f22565b604001511490508538612f1a565b602081015189149250612f14565b612fea91503d8084833e61271c81836105fc565b38612ec0565b612e4e969750918391612e7a613012612eae953d8087833e61271c81836105fc565b99985050915091612e23565b611593906115676106cb946040519485937f95ed0195000000000000000000000000000000000000000000000000000000006020860152602485016129c7565b6040805161306b8161058c565b602f81526130c46020917f2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d204465706c6f796d656e7473202d2d838201527f2d2d2d2d2d2d2d2d2d2d2d2d2d2d2d000000000000000000000000000000000084820152611520565b6007805492906000805b8581106130dd57505050505050565b6131b4908383526126fe6115f6611593613118847fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c68801611c02565b73ffffffffffffffffffffffffffffffffffffffff61317761313c61292484612405565b928c7f1b5b39326d0000000000000000000000000000000000000000000000000000008d519161316b836105e0565b60058352820152611499565b91511689519384927f319af333000000000000000000000000000000000000000000000000000000008d8501528b60248501526064840190610c63565b6130ce56fea2646970667358221220e1471c1461693767593658834dacb723abd61d9b083054785e15db2489ec154a64736f6c63430008130033";

type DeployContractsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: DeployContractsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class DeployContracts__factory extends ContractFactory {
  constructor(...args: DeployContractsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      DeployContracts & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): DeployContracts__factory {
    return super.connect(runner) as DeployContracts__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DeployContractsInterface {
    return new Interface(_abi) as DeployContractsInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): DeployContracts {
    return new Contract(address, _abi, runner) as unknown as DeployContracts;
  }
}
