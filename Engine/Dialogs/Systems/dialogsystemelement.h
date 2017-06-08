/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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
