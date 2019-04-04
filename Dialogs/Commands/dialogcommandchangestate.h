/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
                              QWidget *parent = 0);
     virtual ~DialogCommandChangeState();
     EventCommand* getCommand() const;

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

