/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#ifndef WIDGETTEXTLANG_H
#define WIDGETTEXTLANG_H

#include <QLineEdit>
#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS WidgetTextLang
//
//  A widget used for entering text according to languages.
//
// -------------------------------------------------------

namespace Ui {
class WidgetTextLang;
}

class WidgetTextLang : public QWidget
{
    Q_OBJECT

public:
    explicit WidgetTextLang(QWidget *parent = 0);
    ~WidgetTextLang();
    QLineEdit* lineEdit() const;
    SystemLang* lang() const;
    void initializeNames(SystemLang *l);

private:
    Ui::WidgetTextLang *ui;
    SystemLang* m_lang;

private slots:
    void on_lineEdit_textChanged(const QString &text);
};

#endif // WIDGETTEXTLANG_H
