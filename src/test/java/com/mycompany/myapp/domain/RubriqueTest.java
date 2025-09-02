package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.RubriqueTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RubriqueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Rubrique.class);
        Rubrique rubrique1 = getRubriqueSample1();
        Rubrique rubrique2 = new Rubrique();
        assertThat(rubrique1).isNotEqualTo(rubrique2);

        rubrique2.setId(rubrique1.getId());
        assertThat(rubrique1).isEqualTo(rubrique2);

        rubrique2 = getRubriqueSample2();
        assertThat(rubrique1).isNotEqualTo(rubrique2);
    }
}
