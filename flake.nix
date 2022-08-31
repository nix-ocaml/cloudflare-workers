{
  inputs = {
    nixpkgs.url = "github:nix-ocaml/nix-overlays";

    flake-parts.url = "github:hercules-ci/flake-parts";
    flake-parts.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = { self, flake-parts, ... }: flake-parts.lib.mkFlake { inherit self; } {
    flake = {
      # Put your original flake attributes here.
    };
    systems = [
      # systems for which you want to build the `perSystem` attributes
      "x86_64-linux"
      "aarch64-darwin"
    ];
    perSystem = { config, self', inputs', pkgs, system, ... }: {
      devShells = {
        default = pkgs.mkShell {
          packages = with pkgs; [ yarn nodejs-18_x ];
        };
      };
    };
  };
}
