/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSPECIALELEMENTS_H
#define DIALOGSPECIALELEMENTS_H

#include <QDialog>
#include "picturekind.h"
#include "superlistitem.h"
#include "systemspecialelement.h"

// -------------------------------------------------------
//
//  CLASS DialogSpecialElements
//
//  The special elements (autotiles, sprite walls...) dialog.
//
// -------------------------------------------------------

namespace Ui {
class DialogSpecialElements;
}

class DialogSpecialElements : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSpecialElements(PictureKind kind, QWidget *parent = nullptr);
    ~DialogSpecialElements();

    SystemSpecialElement * getSpecialElement() const;
    void selectSpecialElement(SystemSpecialElement *sys);

private:
    Ui::DialogSpecialElements *ui;

    void translate();
};

#endif // DIALOGSPECIALELEMENTS_H
