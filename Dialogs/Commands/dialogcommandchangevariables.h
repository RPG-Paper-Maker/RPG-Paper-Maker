/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#ifndef DIALOGCOMMANDCHANGEVARIABLES_H
#define DIALOGCOMMANDCHANGEVARIABLES_H

#include <QVector>
#include "dialogcommand.h"
#include "variablesdatas.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeVariables
//
//  A dialog used for changing one or several variables values.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeVariables;
}

class DialogCommandChangeVariables : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeVariables(EventCommand *command = nullptr,
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandChangeVariables();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandChangeVariables *ui;
    QStandardItemModel* m_modelObjects;

    void selection(QVector<QString> &command) const;
    void operation(QVector<QString>& command) const;
    void value(QVector<QString>& command) const;

private slots:
    void on_radioButtonOneVariable_toggled(bool checked);
    void on_radioButtonRange_toggled(bool checked);
    void on_radioButtonNumber_toggled(bool checked);
    void on_radioButtonRandom_toggled(bool checked);
};

#endif // DIALOGCOMMANDCHANGEVARIABLES_H
