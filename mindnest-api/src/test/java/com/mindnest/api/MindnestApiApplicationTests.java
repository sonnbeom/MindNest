package com.mindnest.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = "llm.anthropic.api-key=test-api-key")
class MindnestApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
