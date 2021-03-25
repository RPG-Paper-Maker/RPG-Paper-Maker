/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDWAIT_H
#define DIALOGCOMMANDWAIT_H

#include "dialogcommand.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandWait
//
//  A dialog used for waiting.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandWait;
}

class DialogCommandWait : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandWait(EventCommand *command = nullptr,
        QStandardItemModel *properties = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    virtual ~DialogCommandWait();

    void initializePrimitives();
    void translate();
    void getCommandList(QVector<QString> &command) const;

    virtual EventCommand * getCommand() const;
    virtual void initialize(EventCommand* command);

protected:
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;

private:
    Ui::DialogCommandWait *ui;
};

#endif // DIALOGCOMMANDWAIT_H
