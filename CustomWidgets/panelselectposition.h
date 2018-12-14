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

#ifndef PANELSELECTPOSITION_H
#define PANELSELECTPOSITION_H

#include <QWidget>
#include "eventcommand.h"

// -------------------------------------------------------
//
//  CLASS PanelSelectPosition
//
//  Used for having the option to select a position opening the dialog select
//  position.
//
// -------------------------------------------------------

namespace Ui {
class PanelSelectPosition;
}

class PanelSelectPosition : public QWidget
{
    Q_OBJECT

public:
    explicit PanelSelectPosition(QWidget *parent = nullptr);
    ~PanelSelectPosition();

    void getCommand(QVector<QString> &command) const;
    virtual void initialize(EventCommand* command, int &i);
    virtual void setEnabled(bool checked);

private:
    Ui::PanelSelectPosition *ui;

private slots:
    void on_pushButtonSelect_clicked();
};

#endif // PANELSELECTPOSITION_H
