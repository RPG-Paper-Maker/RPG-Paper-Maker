/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELTRANSFORMATIONS_H
#define PANELTRANSFORMATIONS_H

#include <QWidget>
#include "axiskind.h"
#include "position.h"
#include "drawkind.h"

// -------------------------------------------------------
//
//  CLASS PanelTransformations
//
//  A panel used for displaying translations, rotations, or scaling.
//
// -------------------------------------------------------

namespace Ui {
class PanelTransformations;
}

class PanelTransformations : public QWidget
{
    Q_OBJECT

public:
    explicit PanelTransformations(QWidget *parent = nullptr);
    ~PanelTransformations();
    Position * mapElementPosition() const;
    DrawKind drawKind() const;
    void setDrawKind(DrawKind drawKind);
    bool applyLeftRightClick() const;
    bool bySquare() const;

    AxisKind currentAxisKind() const;
    void setBySquare(bool square);
    void deletePosition();
    void initialize(DrawKind drawKind);
    void translate(DrawKind drawKind);

private:
    Ui::PanelTransformations *ui;

protected:
    Position *m_mapElementPosition;
    DrawKind m_drawKind;

    void updateText();

public slots:
    void on_positionSelected(Position *p, bool positive);
    void on_positionChangedUI(Position &previousPosition);
    void on_checkBoxApplyLeftRightClick_toggled(bool checked);
    void on_checkBoxBySquare_toggled(bool checked);

signals:
    void positionChanged(Position &newPosition, Position &previousPosition);
    void transformationBySquare(bool checked);
};

#endif // PANELTRANSFORMATIONS_H
