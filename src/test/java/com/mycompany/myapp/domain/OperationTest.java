package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.CaisseTestSamples.*;
import static com.mycompany.myapp.domain.ModeOperationTestSamples.*;
import static com.mycompany.myapp.domain.OperationTestSamples.*;
import static com.mycompany.myapp.domain.TypeOperationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OperationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Operation.class);
        Operation operation1 = getOperationSample1();
        Operation operation2 = new Operation();
        assertThat(operation1).isNotEqualTo(operation2);

        operation2.setId(operation1.getId());
        assertThat(operation1).isEqualTo(operation2);

        operation2 = getOperationSample2();
        assertThat(operation1).isNotEqualTo(operation2);
    }

    @Test
    void caisseTest() throws Exception {
        Operation operation = getOperationRandomSampleGenerator();
        Caisse caisseBack = getCaisseRandomSampleGenerator();

        operation.setCaisse(caisseBack);
        assertThat(operation.getCaisse()).isEqualTo(caisseBack);

        operation.caisse(null);
        assertThat(operation.getCaisse()).isNull();
    }

    @Test
    void typeOperationTest() throws Exception {
        Operation operation = getOperationRandomSampleGenerator();
        TypeOperation typeOperationBack = getTypeOperationRandomSampleGenerator();

        operation.setTypeOperation(typeOperationBack);
        assertThat(operation.getTypeOperation()).isEqualTo(typeOperationBack);

        operation.typeOperation(null);
        assertThat(operation.getTypeOperation()).isNull();
    }

    @Test
    void modeOperationTest() throws Exception {
        Operation operation = getOperationRandomSampleGenerator();
        ModeOperation modeOperationBack = getModeOperationRandomSampleGenerator();

        operation.setModeOperation(modeOperationBack);
        assertThat(operation.getModeOperation()).isEqualTo(modeOperationBack);

        operation.modeOperation(null);
        assertThat(operation.getModeOperation()).isNull();
    }
}
