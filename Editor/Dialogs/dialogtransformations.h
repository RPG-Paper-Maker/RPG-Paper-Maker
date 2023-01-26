/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGTRANSFORMATIONS_H
#define DIALOGTRANSFORMATIONS_H

#include <QDialog>
#include "primitivevalue.h"

namespace Ui {
class DialogTransformations;
}

class DialogTransformations : public QDialog
{
    Q_OBJECT

public:
    explicit DialogTransformations(PrimitiveValue *centerX, PrimitiveValue
        *centerY, PrimitiveValue *angleX, PrimitiveValue *angleY,
        PrimitiveValue *angleZ, PrimitiveValue *scaleX, PrimitiveValue *scaleY,
        PrimitiveValue *scaleZ, QWidget *parent = nullptr);
    ~DialogTransformations();

    void initialize();
    void translate();

private:
    Ui::DialogTransformations *ui;
    PrimitiveValue *m_centerX;
    PrimitiveValue *m_centerY;
    PrimitiveValue *m_angleX;
    PrimitiveValue *m_angleY;
    PrimitiveValue *m_angleZ;
    PrimitiveValue *m_scaleX;
    PrimitiveValue *m_scaleY;
    PrimitiveValue *m_scaleZ;
};

#endif // DIALOGTRANSFORMATIONS_H
