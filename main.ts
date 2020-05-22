/*
load dependency
"MCP23017": "file:../pxt-mcp23017"
*/

/*
mcp23017 block
*/
//% weight=20 color=#9900CC icon="\uf13d" block="mcp23017"
namespace MCP23017 {


    const MCP23017_IODIRA = 0x00
    const MCP23017_IPOLA = 0x02
    const MCP23017_GPINTENA = 0x04
    const MCP23017_DEFVALA = 0x06
    const MCP23017_INTCONA = 0x08
    const MCP23017_IOCONA = 0x0A
    const MCP23017_GPPUA = 0x0C
    const MCP23017_INTFA = 0x0E
    const MCP23017_INTCAPA = 0x10
    const MCP23017_GPIOA = 0x12
    const MCP23017_OLATA = 0x14

    const MCP23017_IODIRB = 0x01
    const MCP23017_IPOLB = 0x03
    const MCP23017_GPINTENB = 0x05
    const MCP23017_DEFVALB = 0x07
    const MCP23017_INTCONB = 0x09
    const MCP23017_IOCONB = 0x0B
    const MCP23017_GPPUB = 0x0D
    const MCP23017_INTFB = 0x0F
    const MCP23017_INTCAPB = 0x11
    const MCP23017_GPIOB = 0x13
    const MCP23017_OLATB = 0x15


    export enum REGISTER {
        IODIRA = 0x00,
        IODIRB = 0x01,
        IPOLA = 0x02,
        IPOLB = 0x03,
        GPINTENA = 0x04,
        GPINTENB = 0x05,
        DEFVALA = 0x06,
        DEFVALB = 0x07,
        INTCONA = 0x08,
        INTCONB = 0x09,
        IOCONA = 0x0A,
        IOCONB = 0x0B,
        GPPUA = 0x0C,
        GPPUB = 0x0D,
        INTFA = 0x0E,
        INTFB = 0x0F,
        INTCAPA = 0x10,
        INTCAPB = 0x11,
        GPIOA = 0x12,
        GPIOB = 0x13,
        OLATA = 0x14,
        OLATB = 0x15
    }

    export enum PIN {
        A = 0,
        B = 1
    }


    export enum MCP23017_I2C_ADDRESS {
        ADDR_0x20 = 0x20,
        ADDR_0x21 = 0x21,
        ADDR_0x22 = 0x22,
        ADDR_0x23 = 0x23,
        ADDR_0x24 = 0x24,
        ADDR_0x25 = 0x25,
        ADDR_0x26 = 0x26,
        ADDR_0x27 = 0x27
    }

    function i2cWrite(addr: number, reg: number, value: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(addr, buf);
    }

    function i2cRead(addr: number, reg: number): number {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    /**
	 * 初始化MCP23017
	 * @param addr [0-7] 选择设备地址; 例如: MCP23017.MCP23017_I2C_ADDRESS.ADDR_0x27
	*/
    //% blockId="MCP23017_initMCP23017"
    //% block="初始化MCP23017 地址: %addr"
    //% weight=85
    function initMCP23017(addr: MCP23017_I2C_ADDRESS): void {
        if (addr >= MCP23017_I2C_ADDRESS.ADDR_0x20 && addr <= MCP23017_I2C_ADDRESS.ADDR_0x27) {
            for (let regAddr = 0; regAddr < 22; regAddr++) {
                if (regAddr == 0 || regAddr == 1) {
                    i2cWrite(addr, regAddr, 0xFF);
                }
                else {
                    i2cWrite(addr, regAddr, 0x00);
                }
            }
        }
    }


    /**
	 * 从MCP23017寄存器读取数据
	 * @param reg [0-21] 寄存器地址; eg: 0, 15, 23
	*/
    //% blockId=MCP23017_readReg 
    //% block="读取寄存器 |%reg| 数据"
    //% weight=75
    export function readReg(addr: MCP23017_I2C_ADDRESS, reg: REGISTER): number {
        let val = i2cRead(addr, reg);
        return val;
    }


	/**
	 * 写入 MCP23017 PinAx 或者 PinBx
	 * @param pin [0-1] 选择 PinA 或者 PinB; eg: 0, 1
     * @param value [0-255] 写入的值; eg: 128, 0, 255
	*/
    //% blockId=MCP23017_writePin
    //% block="设置 P|%pin| 值 |%value|"
    //% weight=65
    //% value.min=0 value.max=255
    export function writePin(addr: MCP23017_I2C_ADDRESS , pin: PIN, value: number): void {
        if (pin == 0) {
            i2cWrite(addr, MCP23017_IODIRA, 0x00);
            i2cWrite(addr, MCP23017_GPIOA, value);
        }
        else {
            i2cWrite(addr, MCP23017_IODIRB, 0x00);
            i2cWrite(addr, MCP23017_GPIOB, value);
        }
    }

	/**
	 * 读取 MCP23017 PinA 或者 PinB 的数据 
	 * @param pin [0-1] 选择 PinA 或者 PinB; eg: 0, 1
	*/
    //% blockId=MCP23017_readPin
    //% block="从 P|%pin| 读取数据"
    //% weight=55
    export function readPin(addr: MCP23017_I2C_ADDRESS, pin: PIN): number {
        if (pin == 0) {

            //configue all PinA input
            i2cWrite(addr, MCP23017_IODIRA, 0xFF);

            //configue all PinA pullUP
            i2cWrite(addr, MCP23017_GPPUA, 0xFF);

            let val = i2cRead(addr, MCP23017_GPIOA);

            return val;
        }
        else {

            //configue all PinB input
            i2cWrite(addr, MCP23017_IODIRB, 0xFF);

            //configue all PinB pullUP
            i2cWrite(addr, MCP23017_GPPUB, 0xFF);

            let val = i2cRead(addr, MCP23017_GPIOB);

            return val;
        }
    }
}




