package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.TypeOperationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TypeOperationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TypeOperation.class);
        TypeOperation typeOperation1 = getTypeOperationSample1();
        TypeOperation typeOperation2 = new TypeOperation();
        assertThat(typeOperation1).isNotEqualTo(typeOperation2);

        typeOperation2.setId(typeOperation1.getId());
        assertThat(typeOperation1).isEqualTo(typeOperation2);

        typeOperation2 = getTypeOperationSample2();
        assertThat(typeOperation1).isNotEqualTo(typeOperation2);
    }
}
