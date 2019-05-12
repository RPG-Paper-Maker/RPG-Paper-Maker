/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGSYSTEMELEMENT_H
#define DIALOGSYSTEMELEMENT_H

#include <QDialog>
#include "systemelement.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemElement
//
//  A dialog used for editing the model of a system element.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemElement;
}

class DialogSystemElement : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemElement(SystemElement& element, QWidget *parent = 0);
    ~DialogSystemElement();
    SystemElement& element() const;

private:
    Ui::DialogSystemElement *ui;
    SystemElement& m_element;
    void initialize();
};

#endif // DIALOGSYSTEMELEMENT_H
