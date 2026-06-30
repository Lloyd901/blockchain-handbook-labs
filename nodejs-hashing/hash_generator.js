const crypto = require('crypto');
const fs = require('fs');

/**
 * 生成字符串的 SHA-256 哈希
 */
function hashString(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * 生成文件的 SHA-256 哈希
 */
function hashFile(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

/**
 * 演示雪崩效应：改变一个字符，哈希完全改变
 */
function demonstrateAvalancheEffect() {
    console.log('========== 雪崩效应演示 ==========\n');
    
    const original = 'Hello, Blockchain!';
    const modified = 'Hello, Blockchain?';  // 只改了一个字符
    
    const hash1 = hashString(original);
    const hash2 = hashString(modified);
    
    console.log(`原文: "${original}"`);
    console.log(`哈希: ${hash1}\n`);
    console.log(`修改后: "${modified}"`);
    console.log(`哈希: ${hash2}\n`);
    
    console.log(`两个哈希是否相同? ${hash1 === hash2 ? '是 ❌' : '否 ✅'}`);
    console.log(`(仅修改一个字符，哈希完全改变，这就是雪崩效应)`);
}

/**
 * 交互式哈希生成（可被前端/命令行调用）
 */
function generateHash(input) {
    if (typeof input === 'string' && input.startsWith('file:')) {
        // 用法: node hash_generator.js file:./test.txt
        const filePath = input.substring(5);
        try {
            return hashFile(filePath);
        } catch (err) {
            return `Error: 无法读取文件 ${filePath}`;
        }
    }
    return hashString(input);
}

// ============ 主程序 ============
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        // 无参数：运行演示
        demonstrateAvalancheEffect();
        console.log('\n用法:');
        console.log('  node hash_generator.js "your text"     # 哈希文本');
        console.log('  node hash_generator.js file:./test.txt # 哈希文件');
    } else {
        const input = args[0];
        const result = generateHash(input);
        console.log(result);
    }
}

module.exports = { hashString, hashFile, generateHash };
