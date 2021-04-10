/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGEASTATISTIC_H
#define DIALOGCOMMANDCHANGEASTATISTIC_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeAStatistic
//
//  A dialog used for changing a statistic value.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeAStatistic;
}

class DialogCommandChangeAStatistic : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandChangeAStatistic(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandChangeAStatistic();

    virtual EventCommand * getCommand() const;

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

    void initializePrimitives();
    virtual void initialize(EventCommand* command);

private:
    Ui::DialogCommandChangeAStatistic *ui;

    void translate();
};

#endif // DIALOGCOMMANDCHANGEASTATISTIC_H
