package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.OperationTestSamples.*;
import static com.mycompany.myapp.domain.PieceJustificatifTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PieceJustificatifTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(PieceJustificatif.class);
        PieceJustificatif pieceJustificatif1 = getPieceJustificatifSample1();
        PieceJustificatif pieceJustificatif2 = new PieceJustificatif();
        assertThat(pieceJustificatif1).isNotEqualTo(pieceJustificatif2);

        pieceJustificatif2.setId(pieceJustificatif1.getId());
        assertThat(pieceJustificatif1).isEqualTo(pieceJustificatif2);

        pieceJustificatif2 = getPieceJustificatifSample2();
        assertThat(pieceJustificatif1).isNotEqualTo(pieceJustificatif2);
    }

    @Test
    void operationTest() throws Exception {
        PieceJustificatif pieceJustificatif = getPieceJustificatifRandomSampleGenerator();
        Operation operationBack = getOperationRandomSampleGenerator();

        pieceJustificatif.setOperation(operationBack);
        assertThat(pieceJustificatif.getOperation()).isEqualTo(operationBack);

        pieceJustificatif.operation(null);
        assertThat(pieceJustificatif.getOperation()).isNull();
    }
}
