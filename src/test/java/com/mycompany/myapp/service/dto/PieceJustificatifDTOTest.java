package com.mycompany.myapp.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PieceJustificatifDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(PieceJustificatifDTO.class);
        PieceJustificatifDTO pieceJustificatifDTO1 = new PieceJustificatifDTO();
        pieceJustificatifDTO1.setId(1L);
        PieceJustificatifDTO pieceJustificatifDTO2 = new PieceJustificatifDTO();
        assertThat(pieceJustificatifDTO1).isNotEqualTo(pieceJustificatifDTO2);
        pieceJustificatifDTO2.setId(pieceJustificatifDTO1.getId());
        assertThat(pieceJustificatifDTO1).isEqualTo(pieceJustificatifDTO2);
        pieceJustificatifDTO2.setId(2L);
        assertThat(pieceJustificatifDTO1).isNotEqualTo(pieceJustificatifDTO2);
        pieceJustificatifDTO1.setId(null);
        assertThat(pieceJustificatifDTO1).isNotEqualTo(pieceJustificatifDTO2);
    }
}
