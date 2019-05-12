/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGSPECIALELEMENTS_H
#define DIALOGSPECIALELEMENTS_H

#include <QDialog>
#include "picturekind.h"
#include "superlistitem.h"

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
    explicit DialogSpecialElements(PictureKind kind, QWidget *parent = 0);
    ~DialogSpecialElements();

private:
    Ui::DialogSpecialElements *ui;
};

#endif // DIALOGSPECIALELEMENTS_H
