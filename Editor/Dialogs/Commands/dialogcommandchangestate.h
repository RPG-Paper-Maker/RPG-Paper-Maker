/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDCHANGESTATE_H
#define DIALOGCOMMANDCHANGESTATE_H

#include "dialogcommand.h"
#include "systemcommonobject.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandChangeState
//
//  A dialog used for changing the state of one or several objects.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandChangeState;
}

class DialogCommandChangeState : public DialogCommand
{
    Q_OBJECT

public:
     DialogCommandChangeState(EventCommand *command = nullptr,
                              SystemCommonObject *object = nullptr,
                              QStandardItemModel* parameters = nullptr,
                              QWidget *parent = nullptr);
     virtual ~DialogCommandChangeState();
     EventCommand * getCommand() const;

protected:
     virtual void initialize(EventCommand* command);

private:
     Ui::DialogCommandChangeState *ui;
     SystemCommonObject* m_object;
     QStandardItemModel* m_parameters;

     void initializeStateId();
     void selectionState(QVector<QString>& command) const;
     void operation(QVector<QString>& command) const;
};

#endif // DIALOGCOMMANDCHANGESTATE_H

