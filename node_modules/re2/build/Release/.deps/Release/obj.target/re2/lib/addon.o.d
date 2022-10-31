cmd_Release/obj.target/re2/lib/addon.o := g++ -o Release/obj.target/re2/lib/addon.o ../lib/addon.cc '-DNODE_GYP_MODULE_NAME=re2' '-DUSING_UV_SHARED=1' '-DUSING_V8_SHARED=1' '-DV8_DEPRECATION_WARNINGS=1' '-DV8_DEPRECATION_WARNINGS' '-DV8_IMMINENT_DEPRECATION_WARNINGS' '-D_GLIBCXX_USE_CXX11_ABI=1' '-D_LARGEFILE_SOURCE' '-D_FILE_OFFSET_BITS=64' '-D__STDC_FORMAT_MACROS' '-DOPENSSL_NO_PINSHARED' '-DOPENSSL_THREADS' '-DNDEBUG' '-DNOMINMAX' '-DBUILDING_NODE_EXTENSION' -I/root/.cache/node-gyp/16.15.1/include/node -I/root/.cache/node-gyp/16.15.1/src -I/root/.cache/node-gyp/16.15.1/deps/openssl/config -I/root/.cache/node-gyp/16.15.1/deps/openssl/openssl/include -I/root/.cache/node-gyp/16.15.1/deps/uv/include -I/root/.cache/node-gyp/16.15.1/deps/zlib -I/root/.cache/node-gyp/16.15.1/deps/v8/include -I../../nan -I../vendor  -fPIC -pthread -Wall -Wextra -Wno-unused-parameter -m64 -std=c++14 -Wall -Wextra -Wno-sign-compare -Wno-unused-parameter -Wno-missing-field-initializers -Wno-cast-function-type -O3 -g -pthread -O3 -fno-omit-frame-pointer -fno-rtti -fno-exceptions -std=gnu++14 -MMD -MF ./Release/.deps/Release/obj.target/re2/lib/addon.o.d.raw   -c
Release/obj.target/re2/lib/addon.o: ../lib/addon.cc \
 ../lib/./wrapped_re2.h ../../nan/nan.h \
 /root/.cache/node-gyp/16.15.1/include/node/node_version.h \
 /root/.cache/node-gyp/16.15.1/include/node/uv.h \
 /root/.cache/node-gyp/16.15.1/include/node/uv/errno.h \
 /root/.cache/node-gyp/16.15.1/include/node/uv/version.h \
 /root/.cache/node-gyp/16.15.1/include/node/uv/unix.h \
 /root/.cache/node-gyp/16.15.1/include/node/uv/threadpool.h \
 /root/.cache/node-gyp/16.15.1/include/node/uv/linux.h \
 /root/.cache/node-gyp/16.15.1/include/node/node.h \
 /root/.cache/node-gyp/16.15.1/include/node/v8.h \
 /root/.cache/node-gyp/16.15.1/include/node/cppgc/common.h \
 /root/.cache/node-gyp/16.15.1/include/node/v8config.h \
 /root/.cache/node-gyp/16.15.1/include/node/v8-internal.h \
 /root/.cache/node-gyp/16.15.1/include/node/v8-version.h \
 /root/.cache/node-gyp/16.15.1/include/node/v8config.h \
 /root/.cache/node-gyp/16.15.1/include/node/v8-platform.h \
 /root/.cache/node-gyp/16.15.1/include/node/node_version.h \
 /root/.cache/node-gyp/16.15.1/include/node/node_buffer.h \
 /root/.cache/node-gyp/16.15.1/include/node/node.h \
 /root/.cache/node-gyp/16.15.1/include/node/node_object_wrap.h \
 ../../nan/nan_callbacks.h ../../nan/nan_callbacks_12_inl.h \
 ../../nan/nan_maybe_43_inl.h ../../nan/nan_converters.h \
 ../../nan/nan_converters_43_inl.h ../../nan/nan_new.h \
 ../../nan/nan_implementation_12_inl.h ../../nan/nan_persistent_12_inl.h \
 ../../nan/nan_weak.h ../../nan/nan_object_wrap.h ../../nan/nan_private.h \
 ../../nan/nan_typedarray_contents.h ../../nan/nan_json.h \
 ../../nan/nan_scriptorigin.h ../vendor/re2/re2.h \
 ../vendor/re2/stringpiece.h
../lib/addon.cc:
../lib/./wrapped_re2.h:
../../nan/nan.h:
/root/.cache/node-gyp/16.15.1/include/node/node_version.h:
/root/.cache/node-gyp/16.15.1/include/node/uv.h:
/root/.cache/node-gyp/16.15.1/include/node/uv/errno.h:
/root/.cache/node-gyp/16.15.1/include/node/uv/version.h:
/root/.cache/node-gyp/16.15.1/include/node/uv/unix.h:
/root/.cache/node-gyp/16.15.1/include/node/uv/threadpool.h:
/root/.cache/node-gyp/16.15.1/include/node/uv/linux.h:
/root/.cache/node-gyp/16.15.1/include/node/node.h:
/root/.cache/node-gyp/16.15.1/include/node/v8.h:
/root/.cache/node-gyp/16.15.1/include/node/cppgc/common.h:
/root/.cache/node-gyp/16.15.1/include/node/v8config.h:
/root/.cache/node-gyp/16.15.1/include/node/v8-internal.h:
/root/.cache/node-gyp/16.15.1/include/node/v8-version.h:
/root/.cache/node-gyp/16.15.1/include/node/v8config.h:
/root/.cache/node-gyp/16.15.1/include/node/v8-platform.h:
/root/.cache/node-gyp/16.15.1/include/node/node_version.h:
/root/.cache/node-gyp/16.15.1/include/node/node_buffer.h:
/root/.cache/node-gyp/16.15.1/include/node/node.h:
/root/.cache/node-gyp/16.15.1/include/node/node_object_wrap.h:
../../nan/nan_callbacks.h:
../../nan/nan_callbacks_12_inl.h:
../../nan/nan_maybe_43_inl.h:
../../nan/nan_converters.h:
../../nan/nan_converters_43_inl.h:
../../nan/nan_new.h:
../../nan/nan_implementation_12_inl.h:
../../nan/nan_persistent_12_inl.h:
../../nan/nan_weak.h:
../../nan/nan_object_wrap.h:
../../nan/nan_private.h:
../../nan/nan_typedarray_contents.h:
../../nan/nan_json.h:
../../nan/nan_scriptorigin.h:
../vendor/re2/re2.h:
../vendor/re2/stringpiece.h:
