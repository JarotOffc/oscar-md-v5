cmd_Release/re2.node := ln -f "Release/obj.target/re2.node" "Release/re2.node" 2>/dev/null || (rm -rf "Release/re2.node" && cp -af "Release/obj.target/re2.node" "Release/re2.node")
