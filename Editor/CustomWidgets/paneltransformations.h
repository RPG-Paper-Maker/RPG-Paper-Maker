/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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

    AxisKind currentAxisKind() const;
    void initialize();

private:
    Ui::PanelTransformations *ui;
};

#endif // PANELTRANSFORMATIONS_H
