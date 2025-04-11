0x55a9e0000040     0   push rbp
0x55a9e0000041     1   REX.W movq rbp,rsp
0x55a9e0000044     4   push rsi
0x55a9e0000045     5   push rdi
0x55a9e0000046     6   push rax
0x55a9e0000047     7   REX.W subq rsp,0x8
0x55a9e000004b     b   REX.W movq [rbp-0x20],rsi
0x55a9e000004f     f   REX.W cmpq rsp,[r13-0x60] (external value (StackGuard::address_of_jslimit()))
0x55a9e0000053    13   jna 0x55a9e00000b7  <+0x77>
0x55a9e0000059    19   REX.W movq rdx,[rbp+0x18]   ;; rdx = n
0x55a9e000005d    1d   testb rdx,0x1               ;; test bit rdx
0x55a9e0000060    20   jnz 0x55a9e00000e1  <+0xa1> ;; if 1, jump 0x55a9e00000e1
                                                   ;; so this can jump to return true
0x55a9e0000066    26   REX.W movq rcx,rdx          ;; else rcx = rdx
0x55a9e0000069    29   sarl rcx, 1                 ;; rcx >> 1 why? (keep sign bit)
0x55a9e000006b    2b   testl rdx,rdx
0x55a9e000006d    2d   jl 0x55a9e000007b  <+0x3b>
0x55a9e0000073    33   andl rcx,0x1
0x55a9e0000076    36   jmp 0x55a9e000008a  <+0x4a>
0x55a9e000007b    3b   negl rcx
0x55a9e000007d    3d   andl rcx,0x1
0x55a9e0000080    40   testl rcx,rcx
0x55a9e0000082    42   jz 0x55a9e00000e5  <+0xa5>
0x55a9e0000088    48   negl rcx
0x55a9e000008a    4a   cmpl rcx,0x1
0x55a9e000008d    4d   jz 0x55a9e00000b1  <+0x71>
0x55a9e0000093    53   REX.W leaq rax,[r14+0x55]
0x55a9e0000097    57   REX.W movq rcx,[rbp-0x18]
0x55a9e000009b    5b   REX.W movq rsp,rbp
0x55a9e000009e    5e   pop rbp
0x55a9e000009f    5f   REX.W cmpq rcx,0x2
0x55a9e00000a3    63   jg 0x55a9e00000a8  <+0x68>
0x55a9e00000a5    65   ret 0x10
0x55a9e00000a8    68   pop r10
0x55a9e00000aa    6a   REX.W leaq rsp,[rsp+rcx*8]
0x55a9e00000ae    6e   push r10
0x55a9e00000b0    70   retl
0x55a9e00000b1    71   REX.W leaq rax,[r14+0x71]
0x55a9e00000b5    75   jmp 0x55a9e0000097  <+0x57>
0x55a9e00000b7    77   movl rdx,0x40
0x55a9e00000bc    7c   push rdx
0x55a9e00000bd    7d   REX.W movq rbx,0x55a9c75f4000
0x55a9e00000c7    87   movl rax,0x1
0x55a9e00000cc    8c   REX.W movq rsi,0x7df500181ae5    ;; object: 0x7df500181ae5 <NativeContext[302]>
0x55a9e00000d6    96   call 0x55a9c846a300  (CEntry_Return1_ArgvOnStack_NoBuiltinExit)    ;; near builtin entry
0x55a9e00000db    9b   jmp 0x55a9e0000059  <+0x19>
0x55a9e00000e0    a0   nop
0x55a9e00000e1    a1   call [r13-0x28]  ;; stack pointer - 0x28
0x55a9e00000e5    a5   call [r13-0x28]  ;; stack pointer - 0x28
0x55a9e00000e9    a9   call [r13-0x20]  ;; stack pointer - 0x28
0x55a9e00000ed    ad   nop
