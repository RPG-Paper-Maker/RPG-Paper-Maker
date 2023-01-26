/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELSUBTRANSFORMATION_H
#define PANELSUBTRANSFORMATION_H

#include <QWidget>
#include "axiskind.h"
#include "mapelement.h"
#include "drawkind.h"

// -------------------------------------------------------
//
//  CLASS PanelSubTransformation
//
//  A panel used for displaying changes parameters for transformation.
//
// -------------------------------------------------------

namespace Ui {
class PanelSubTransformation;
}

class PanelSubTransformation : public QWidget
{
    Q_OBJECT

public:
    explicit PanelSubTransformation(QWidget *parent = nullptr);
    ~PanelSubTransformation();

    void setMapElementPosition(Position *p);

    bool operation() const;
    double value() const;
    void initialize(DrawKind drawKind, AxisKind ak);
    void updatePositionAuto();
    void updatePositionClick(bool positive = true);
    void updateApplyLeftRightEnabled(bool checked);
    void translate(DrawKind drawKind, AxisKind axisKind);

private:
    Ui::PanelSubTransformation *ui;

protected:
    Position *m_mapElementPosition;
    AxisKind m_axisKind;
    DrawKind m_drawKind;

public slots:
    void on_comboBoxOperation_currentIndexChanged(int index);
    void on_doubleSpinBoxAngle_valueChanged(double);
    void on_pushButtonDefineDefault_clicked();
    void on_pushButtonResetDefault_clicked();

signals:
    void positionChanged(Position &newPosition);
};

#endif // PANELSUBTRANSFORMATION_H
