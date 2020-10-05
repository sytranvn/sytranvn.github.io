# Scanning
```cpp
class Scanner {
 public:

  typedef unibrow::Utf8InputBuffer<1024> Utf8Decoder;

  // Construction
  explicit Scanner(bool is_pre_parsing);

  // Initialize the Scanner to scan source:
  void Init(Handle<String> source,
            unibrow::CharacterStream* stream,
            int position);
}

```
