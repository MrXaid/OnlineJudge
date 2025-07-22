// src/constants/languages.js

export const LANGUAGES = [
  {
    id: 'cpp',
    name: 'C++',
    editorLanguage: 'cpp',
    defaultCode: `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    cout << "Hello, C++!" << endl;
    return 0;
}
`,
  },
  {
    id: 'java',
    name: 'Java',
    editorLanguage: 'java',
    defaultCode: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello, Java!");
    }
}
`,
  },
  {
    id: 'python',
    name: 'Python',
    editorLanguage: 'python',
    defaultCode: `# Write your code here
print("Hello, Python!")
`,
  },
];
