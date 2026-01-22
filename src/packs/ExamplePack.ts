// import { TaskPack } from './Pack';



// const ExamplePack = TaskPack
//   .Build()
//   .title("Hello World")
//   .key("example-helloworld")
//   .question("Print hello world using the shell")
//   .addBufferTest()
//     .setExpected("Hello World\n")
//     .next()
//   .userspace()
//     .addUser('user1')
//       .password('hellopassword101')
//     .addFile('/home/user1/samplefile.txt')
//       .contents("This is a basic file")
//     .next()
//   .vmconfig()
//     .title("alpine01")
//     .description("basic alpine VM")
//     .memory(512)
//     .vgaMemory(8)
//     .baseURL("/alpine-rootfs-flat")
//     .baseFS("/alpine-fs.json")
//     .initialState("/alpine-login.bin")
//     .setCommandLine("rw root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose modules=virtio_pci tsc=reliable")
//     .useScreen()
//     .useConsole()
//     .useNetwork()
//     .autoStart()
//   .finalize();
